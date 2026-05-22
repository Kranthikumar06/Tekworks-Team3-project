import { useMemo, useState } from 'react'
import './App.css'

type FieldType = 'text' | 'number' | 'select'

type FieldConfig = {
  name: string
  type: FieldType
  placeholder?: string
  options?: string[]
}

type ViewConfig = {
  id: string
  label: string
  title: string
  description: string
  fields: FieldConfig[]
}

function App() {
  const [activeView, setActiveView] = useState('churn')
  const [formState, setFormState] = useState<Record<string, Record<string, string>>>(
    {},
  )
  const [result, setResult] = useState<Record<string, string>>({
    prediction: 'Awaiting input',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const views = useMemo<ViewConfig[]>(
    () => [
      {
        id: 'churn',
        label: 'Churn Prediction',
        title: 'Churn Prediction',
        description:
          'Estimate customer churn risk using contract and service signals.',
        fields: [
          { name: 'Senior Citizen', type: 'select', options: ['Yes', 'No'] },
          { name: 'Dependents', type: 'select', options: ['Yes', 'No'] },
          { name: 'Tenure Months', type: 'number', placeholder: 'e.g., 12' },
          {
            name: 'Contract',
            type: 'select',
            options: ['Month-to-month', 'One year', 'Two year'],
          },
          {
            name: 'Payment Method',
            type: 'select',
            options: [
              'Electronic check',
              'Mailed check',
              'Bank transfer (automatic)',
              'Credit card (automatic)',
            ],
          },
          { name: 'Monthly Charges', type: 'number', placeholder: 'e.g., 75.35' },
        ],
      },
      {
        id: 'subscription',
        label: 'Subscription Renewal',
        title: 'Subscription Renewal Prediction',
        description:
          'Predict renewal likelihood based on plan, payment, and support signals.',
        fields: [
          { name: 'tenure', type: 'number', placeholder: 'e.g., 4' },
          {
            name: 'Contract',
            type: 'select',
            options: ['Month-to-month', 'One year', 'Two year'],
          },
          { name: 'MonthlyCharges', type: 'number', placeholder: 'e.g., 29.85' },
          {
            name: 'PaymentMethod',
            type: 'select',
            options: [
              'Electronic check',
              'Mailed check',
              'Bank transfer (automatic)',
              'Credit card (automatic)',
            ],
          },
          {
            name: 'InternetService',
            type: 'select',
            options: ['DSL', 'Fiber optic', 'No'],
          },
          { name: 'TechSupport', type: 'select', options: ['Yes', 'No'] },
        ],
      },
      {
        id: 'market',
        label: 'Market Response',
        title: 'Market Response Prediction',
        description:
          'Forecast campaign response from demographic and financial signals.',
        fields: [
          { name: 'age', type: 'number', placeholder: 'e.g., 35' },
          { name: 'annual_income', type: 'number', placeholder: 'e.g., 65000' },
          { name: 'credit_score', type: 'number', placeholder: 'e.g., 720' },
          { name: 'no_of_children', type: 'number', placeholder: 'e.g., 2' },
          { name: 'gender', type: 'select', options: ['Male', 'Female'] },
          { name: 'employed', type: 'select', options: ['Yes', 'No'] },
          {
            name: 'marital_status',
            type: 'select',
            options: ['Married', 'Single'],
          },
        ],
      },
      {
        id: 'product',
        label: 'Product Demand',
        title: 'Product Demand Forecasting',
        description:
          'Predict demand from sales, revenue, and seasonal indicators.',
        fields: [
          { name: 'Units_Sold', type: 'number', placeholder: 'e.g., 41' },
          { name: 'Revenue', type: 'number', placeholder: 'e.g., 1350.55' },
          { name: 'Marketing_Spend', type: 'number', placeholder: 'e.g., 8329.69' },
          { name: 'Holiday_Indicator', type: 'number', placeholder: 'e.g., 0' },
          { name: 'Season', type: 'select', options: ['Summer', 'Winter', 'Rainy'] },
        ],
      },
    ],
    [],
  )

  const active = views.find((view) => view.id === activeView) ?? views[0]

  const handleFieldChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [activeView]: {
        ...(prev[activeView] ?? {}),
        [name]: value,
      },
    }))
  }

  const handleClear = () => {
    setFormState((prev) => ({
      ...prev,
      [activeView]: {},
    }))
    setResult({ prediction: 'Awaiting input' })
    setError('')
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
      const payload = formState[activeView] ?? {}
      const seasonMap: Record<string, number> = {
        Summer: 1,
        Winter: 2,
        Rainy: 3,
      }

      const formattedPayload = Object.fromEntries(
        Object.entries(payload).map(([key, value]) => {
          if (activeView === 'product' && key === 'Season') {
            return [key, seasonMap[value] ?? value]
          }
          return [
            key,
            value !== '' && !Number.isNaN(Number(value)) && value.match(/^[0-9.]+$/)
              ? Number(value)
              : value,
          ]
        }),
      )

      const endpointMap: Record<string, string> = {
        churn: '/predict/churn',
        subscription: '/predict/subscription',
        market: '/predict/market',
        product: '/predict/product-demand',
      }

      const body =
        activeView === 'market' ? formattedPayload : { data: formattedPayload }

      const response = await fetch(
        `${apiBaseUrl}${endpointMap[activeView]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Request failed')
      }

      const data = await response.json()
      let displayPrediction = String(data.prediction ?? 'No result')
      if (activeView === 'subscription' && typeof data.prediction === 'number') {
        displayPrediction = data.prediction === 1 ? 'Yes' : 'No'
      }
      setResult({
        prediction: displayPrediction,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
      setResult({ prediction: 'Error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"></div>
          <div>
            <span className="brand-title">
              Customer Intelligence and Decision Analytics System
            </span>
            <span className="brand-subtitle">
              Centralized prediction workspace
            </span>
          </div>
        </div>
        <nav className="nav">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`nav-button ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setActiveView(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="panel">
        <section className="panel-header">
          <div>
            <h1>{active.title}</h1>
            <p>{active.description}</p>
          </div>
          <div className="status-card">
            <span className="status-label">Model status</span>
            <span className="status-value">Ready</span>
          </div>
        </section>

        <section className="panel-body">
          <div className="form-grid">
            {active.fields.map((field: FieldConfig) => (
              <label key={field.name} className="form-field">
                <span>{field.name}</span>
                {field.type === 'select' ? (
                  <select
                    value={(formState[activeView] ?? {})[field.name] ?? ''}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(formState[activeView] ?? {})[field.name] ?? ''}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                    step={field.type === 'number' ? '1' : undefined}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Running...' : 'Run Prediction'}
            </button>
            <button type="button" className="ghost-button" onClick={handleClear}>
              Clear Inputs
            </button>
          </div>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="result-panel">
            <div>
              <span className="result-label">Prediction Output</span>
              <p className="result-value">{result.prediction}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
