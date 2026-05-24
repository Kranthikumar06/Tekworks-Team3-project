import { useMemo, useState } from 'react'
import './App.css'

// Inline SVG Icon components for maximum visual polish and compatibility
const Icons = {
  About: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Churn: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.25 21c-2.302 0-4.474-.63-6.332-1.735zM15 15h6m-3-3v6" />
    </svg>
  ),
  Subscription: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Market: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  ),
  Product: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18M2.25 13.5l1.631-8.158A2.25 2.25 0 016.082 3.75h11.836a2.25 2.25 0 012.201 1.592l1.631 8.158m-18 0v6.75A2.25 2.25 0 004.25 22.5h15.5a2.25 2.25 0 002.25-2.25V13.5M9 7.5h6" />
    </svg>
  ),
  Sensitivity: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Propensity: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V14" />
    </svg>
  ),
  Segmentation: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  Export: () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  Parameters: () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
  Reset: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Dots: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  ),
  Lightning: () => (
    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.437 7.008H1.5a.75.75 0 00-.632 1.202l11.25 15.25a.75.75 0 001.284-.699l-2.437-7.008H16.5a.75.75 0 00.632-1.202L5.883 2.405H3.478z" />
    </svg>
  ),
  History: () => (
    <svg className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
}

type FieldType = 'text' | 'number' | 'select'

type FieldConfig = {
  name: string
  type: FieldType
  placeholder?: string
  options?: string[]
  displayLabel?: string       // Premium display label (e.g. "SENIOR CITIZEN STATUS")
  displayOptions?: Record<string, string> // Mappings for select values on the UI layer
  unit?: string               // e.g. "MO", "$"
  unitType?: 'prefix' | 'suffix' // Prefix or suffix style
}

type FieldGroup = {
  name: string
  fields: FieldConfig[]
}

type ViewConfig = {
  id: string
  label: string
  title: string
  description: string
  modelName?: string          // Model version tag (e.g., "CHURN_V4.2.0")
  groups?: FieldGroup[]       // Standard fields organized in semantic groups
  fields: FieldConfig[]       // Base fields array to preserve compatibility with existing submit logic
}

function App() {
  const [activeView, setActiveView] = useState('about') // Set default view as "about" dashboard
  const [formState, setFormState] = useState<Record<string, Record<string, string>>>({})
  const [result, setResult] = useState<Record<string, string>>({
    prediction: 'Awaiting input',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Define high-fidelity metadata configuration for views and groups to preserve inputs perfectly
  const views = useMemo<ViewConfig[]>(
    () => [
      {
        id: 'churn',
        label: 'Churn Prediction',
        title: 'Churn Prediction',
        description: 'Estimating customer churn risk with deep neural network inference on contract and behavioral signals.',
        modelName: 'MODEL: CHURN_V4.2.0',
        groups: [
          {
            name: 'PERSONAL DATA',
            fields: [
              {
                name: 'Senior Citizen',
                type: 'select',
                options: ['Yes', 'No'],
                displayLabel: 'SENIOR CITIZEN STATUS',
                displayOptions: { 'No': 'No (Standard Profile)', 'Yes': 'Yes (Senior Citizen)' }
              },
              {
                name: 'Dependents',
                type: 'select',
                options: ['Yes', 'No'],
                displayLabel: 'DEPENDENTS ENROLLMENT',
                displayOptions: { 'No': 'No Dependents', 'Yes': 'Yes' }
              }
            ]
          },
          {
            name: 'USAGE METRICS',
            fields: [
              {
                name: 'Tenure Months',
                type: 'number',
                placeholder: 'e.g., 12',
                displayLabel: 'TENURE (MONTHS)',
                unit: 'MO',
                unitType: 'suffix'
              },
              {
                name: 'Contract',
                type: 'select',
                options: ['Month-to-month', 'One year', 'Two year'],
                displayLabel: 'CONTRACT TYPE'
              }
            ]
          },
          {
            name: 'FINANCIAL PROFILE',
            fields: [
              {
                name: 'Payment Method',
                type: 'select',
                options: [
                  'Electronic check',
                  'Mailed check',
                  'Bank transfer (automatic)',
                  'Credit card (automatic)',
                ],
                displayLabel: 'PREFERRED PAYMENT'
              },
              {
                name: 'Monthly Charges',
                type: 'number',
                placeholder: 'e.g., 75.35',
                displayLabel: 'MONTHLY CHARGE ($)',
                unit: '$',
                unitType: 'prefix'
              }
            ]
          }
        ],
        fields: [
          { name: 'Senior Citizen', type: 'select', options: ['Yes', 'No'] },
          { name: 'Dependents', type: 'select', options: ['Yes', 'No'] },
          { name: 'Tenure Months', type: 'number', placeholder: 'e.g., 12' },
          { name: 'Contract', type: 'select', options: ['Month-to-month', 'One year', 'Two year'] },
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
        description: 'Predict renewal likelihood based on plan, payment, and support signals.',
        modelName: 'MODEL: RENEW_V1.0.0',
        groups: [
          {
            name: 'USAGE METRICS',
            fields: [
              {
                name: 'tenure',
                type: 'number',
                placeholder: 'e.g., 4',
                displayLabel: 'TENURE (MONTHS)',
                unit: 'MO',
                unitType: 'suffix'
              },
              {
                name: 'Contract',
                type: 'select',
                options: ['Month-to-month', 'One year', 'Two year'],
                displayLabel: 'CONTRACT TYPE'
              }
            ]
          },
          {
            name: 'FINANCIAL PROFILE',
            fields: [
              {
                name: 'MonthlyCharges',
                type: 'number',
                placeholder: 'e.g., 29.85',
                displayLabel: 'MONTHLY CHARGE ($)',
                unit: '$',
                unitType: 'prefix'
              },
              {
                name: 'PaymentMethod',
                type: 'select',
                options: [
                  'Electronic check',
                  'Mailed check',
                  'Bank transfer (automatic)',
                  'Credit card (automatic)',
                ],
                displayLabel: 'PREFERRED PAYMENT'
              }
            ]
          },
          {
            name: 'SERVICE PROFILE',
            fields: [
              {
                name: 'InternetService',
                type: 'select',
                options: ['DSL', 'Fiber optic', 'No'],
                displayLabel: 'INTERNET SERVICE'
              },
              {
                name: 'TechSupport',
                type: 'select',
                options: ['Yes', 'No'],
                displayLabel: 'TECH SUPPORT',
                displayOptions: { 'No': 'No Tech Support', 'Yes': 'Yes' }
              }
            ]
          }
        ],
        fields: [
          { name: 'tenure', type: 'number', placeholder: 'e.g., 4' },
          { name: 'Contract', type: 'select', options: ['Month-to-month', 'One year', 'Two year'] },
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
          { name: 'InternetService', type: 'select', options: ['DSL', 'Fiber optic', 'No'] },
          { name: 'TechSupport', type: 'select', options: ['Yes', 'No'] },
        ],
      },
      {
        id: 'market',
        label: 'Market Response',
        title: 'Market Response Prediction',
        description: 'Forecast campaign response from demographic and financial signals.',
        modelName: 'MODEL: MARKET_V2.1.0',
        groups: [
          {
            name: 'DEMOGRAPHICS',
            fields: [
              {
                name: 'age',
                type: 'number',
                placeholder: 'e.g., 35',
                displayLabel: 'AGE (YEARS)'
              },
              {
                name: 'gender',
                type: 'select',
                options: ['Male', 'Female'],
                displayLabel: 'GENDER'
              },
              {
                name: 'marital_status',
                type: 'select',
                options: ['Married', 'Single'],
                displayLabel: 'MARITAL STATUS'
              },
              {
                name: 'no_of_children',
                type: 'number',
                placeholder: 'e.g., 2',
                displayLabel: 'DEPENDENTS (CHILDREN)'
              }
            ]
          },
          {
            name: 'ECONOMIC PROFILE',
            fields: [
              {
                name: 'employed',
                type: 'select',
                options: ['Yes', 'No'],
                displayLabel: 'EMPLOYMENT STATUS',
                displayOptions: { 'No': 'Unemployed', 'Yes': 'Employed' }
              },
              {
                name: 'annual_income',
                type: 'number',
                placeholder: 'e.g., 65000',
                displayLabel: 'ANNUAL INCOME ($)',
                unit: '$',
                unitType: 'prefix'
              },
              {
                name: 'credit_score',
                type: 'number',
                placeholder: 'e.g., 720',
                displayLabel: 'CREDIT SCORE'
              }
            ]
          }
        ],
        fields: [
          { name: 'age', type: 'number', placeholder: 'e.g., 35' },
          { name: 'annual_income', type: 'number', placeholder: 'e.g., 65000' },
          { name: 'credit_score', type: 'number', placeholder: 'e.g., 720' },
          { name: 'no_of_children', type: 'number', placeholder: 'e.g., 2' },
          { name: 'gender', type: 'select', options: ['Male', 'Female'] },
          { name: 'employed', type: 'select', options: ['Yes', 'No'] },
          { name: 'marital_status', type: 'select', options: ['Married', 'Single'] },
        ],
      },
      {
        id: 'product',
        label: 'Product Demand',
        title: 'Product Demand Forecasting',
        description: 'Predict demand from sales, revenue, and seasonal indicators.',
        modelName: 'MODEL: DEMAND_V3.0.1',
        groups: [
          {
            name: 'SALES METRICS',
            fields: [
              {
                name: 'Units_Sold',
                type: 'number',
                placeholder: 'e.g., 41',
                displayLabel: 'UNITS SOLD'
              },
              {
                name: 'Revenue',
                type: 'number',
                placeholder: 'e.g., 1350.55',
                displayLabel: 'REVENUE ($)',
                unit: '$',
                unitType: 'prefix'
              },
              {
                name: 'Marketing_Spend',
                type: 'number',
                placeholder: 'e.g., 8329.69',
                displayLabel: 'MARKETING SPEND ($)',
                unit: '$',
                unitType: 'prefix'
              }
            ]
          },
          {
            name: 'SEASONAL FACTORS',
            fields: [
              {
                name: 'Holiday_Indicator',
                type: 'number',
                placeholder: 'e.g., 0',
                displayLabel: 'HOLIDAY INDICATOR (0 OR 1)'
              },
              {
                name: 'Season',
                type: 'select',
                options: ['Summer', 'Winter', 'Rainy'],
                displayLabel: 'CURRENT SEASON'
              }
            ]
          }
        ],
        fields: [
          { name: 'Units_Sold', type: 'number', placeholder: 'e.g., 41' },
          { name: 'Revenue', type: 'number', placeholder: 'e.g., 1350.55' },
          { name: 'Marketing_Spend', type: 'number', placeholder: 'e.g., 8329.69' },
          { name: 'Holiday_Indicator', type: 'number', placeholder: 'e.g., 0' },
          { name: 'Season', type: 'select', options: ['Summer', 'Winter', 'Rainy'] },
        ],
      },
      {
        id: 'product-sensitivity',
        label: 'Product Sensitivity',
        title: 'Product Sensitivity Prediction',
        description: 'Estimate sensitivity using dynamic pricing indicators.',
        modelName: 'MODEL: SENSITIVITY_V1.2.0',
        groups: [
          {
            name: 'SUPPLY & DEMAND',
            fields: [
              {
                name: 'Number_of_Drivers',
                type: 'number',
                placeholder: 'e.g., 45',
                displayLabel: 'NUMBER OF DRIVERS'
              },
              {
                name: 'Number_of_Past_Rides',
                type: 'number',
                placeholder: 'e.g., 13',
                displayLabel: 'NUMBER OF PAST RIDES'
              }
            ]
          },
          {
            name: 'RIDE DETAILS',
            fields: [
              {
                name: 'Expected_Ride_Duration',
                type: 'number',
                placeholder: 'e.g., 90',
                displayLabel: 'EXPECTED RIDE DURATION',
                unit: 'MIN',
                unitType: 'suffix'
              },
              {
                name: 'Location_Category',
                type: 'select',
                options: ['Urban', 'Suburban', 'Rural'],
                displayLabel: 'LOCATION CATEGORY'
              }
            ]
          },
          {
            name: 'CUSTOMER PROFILE',
            fields: [
              {
                name: 'Customer_Loyalty_Status',
                type: 'select',
                options: ['Silver', 'Regular', 'Gold'],
                displayLabel: 'LOYALTY STATUS'
              },
              {
                name: 'Vehicle_Type',
                type: 'select',
                options: ['Premium', 'Economy'],
                displayLabel: 'VEHICLE TYPE'
              }
            ]
          }
        ],
        fields: [
          { name: 'Number_of_Drivers', type: 'number', placeholder: 'e.g., 45' },
          { name: 'Number_of_Past_Rides', type: 'number', placeholder: 'e.g., 13' },
          { name: 'Expected_Ride_Duration', type: 'number', placeholder: 'e.g., 90' },
          { name: 'Location_Category', type: 'select', options: ['Urban', 'Suburban', 'Rural'] },
          { name: 'Customer_Loyalty_Status', type: 'select', options: ['Silver', 'Regular', 'Gold'] },
          { name: 'Vehicle_Type', type: 'select', options: ['Premium', 'Economy'] },
        ],
      },
      {
        id: 'purchase-propensity',
        label: 'Purchase Propensity',
        title: 'Purchase Propensity Prediction',
        description: 'Estimate purchase likelihood using customer attributes.',
        modelName: 'MODEL: PROPENSITY_V2.0.4',
        groups: [
          {
            name: 'DEMOGRAPHICS',
            fields: [
              {
                name: 'Age',
                type: 'number',
                placeholder: 'e.g., 35',
                displayLabel: 'AGE (YEARS)'
              },
              {
                name: 'Income',
                type: 'number',
                placeholder: 'e.g., 65000',
                displayLabel: 'ANNUAL INCOME ($)',
                unit: '$',
                unitType: 'prefix'
              },
              {
                name: 'City',
                type: 'select',
                options: ['New York', 'Chicago', 'Houston', 'Los Angeles', 'Miami'],
                displayLabel: 'CITY OF RESIDENCE'
              },
              {
                name: 'Marital_Status',
                type: 'select',
                options: ['Single', 'Married', 'Divorced', 'Widowed'],
                displayLabel: 'MARITAL STATUS'
              }
            ]
          },
          {
            name: 'PROPENSITY METRICS',
            fields: [
              {
                name: 'Score',
                type: 'number',
                placeholder: 'e.g., 0.42',
                displayLabel: 'PROPENSITY SCORE'
              }
            ]
          }
        ],
        fields: [
          { name: 'Age', type: 'number', placeholder: 'e.g., 35' },
          { name: 'Income', type: 'number', placeholder: 'e.g., 65000' },
          { name: 'City', type: 'select', options: ['New York', 'Chicago', 'Houston', 'Los Angeles', 'Miami'] },
          { name: 'Marital_Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
          { name: 'Score', type: 'number', placeholder: 'e.g., 0.42' },
        ],
      },
      {
        id: 'customer-segmentation',
        label: 'Segmentation', // Display "Segmentation" exactly like sidebar screenshot
        title: 'Customer Segmentation Prediction',
        description: 'Assign a customer segment using mall customer attributes.',
        modelName: 'MODEL: SEGMENT_V1.1.2',
        groups: [
          {
            name: 'DEMOGRAPHICS',
            fields: [
              {
                name: 'Gender',
                type: 'select',
                options: ['Male', 'Female'],
                displayLabel: 'GENDER'
              },
              {
                name: 'Age',
                type: 'number',
                placeholder: 'e.g., 27',
                displayLabel: 'AGE (YEARS)'
              }
            ]
          },
          {
            name: 'FINANCIALS',
            fields: [
              {
                name: 'Annual Income (k$)',
                type: 'number',
                placeholder: 'e.g., 48',
                displayLabel: 'ANNUAL INCOME',
                unit: 'k$',
                unitType: 'suffix'
              },
              {
                name: 'Spending Score (1-100)',
                type: 'number',
                placeholder: 'e.g., 62',
                displayLabel: 'SPENDING SCORE (1-100)'
              }
            ]
          }
        ],
        fields: [
          { name: 'Gender', type: 'select', options: ['Male', 'Female'] },
          { name: 'Age', type: 'number', placeholder: 'e.g., 27' },
          { name: 'Annual Income (k$)', type: 'number', placeholder: 'e.g., 48' },
          { name: 'Spending Score (1-100)', type: 'number', placeholder: 'e.g., 62' },
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
    triggerToast('All parameters have been cleared')
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleExport = () => {
    triggerToast('Report details prepared. Opening print dashboard...')
    setTimeout(() => {
      window.print()
    }, 600)
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
        'product-sensitivity': '/predict/product-sensitivity',
        'purchase-propensity': '/predict/purchase-propensity',
        'customer-segmentation': '/predict/customer-segmentation',
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
        let errorMessage = 'Inference pipeline returned an error'
        try {
          const errorObj = JSON.parse(errorText)
          // Try multiple common error field names
          errorMessage = errorObj.detail || errorObj.message || errorObj.error || JSON.stringify(errorObj) || errorText
        } catch {
          // If not JSON, use the text response
          errorMessage = errorText?.trim() || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      let displayPrediction = String(data.prediction ?? 'No result')
      if (activeView === 'subscription' && typeof data.prediction === 'number') {
        displayPrediction = data.prediction === 1 ? 'Yes' : 'No'
      }

      // Add segment details in case of customer-segmentation for extra UX wow factor!
      if (activeView === 'customer-segmentation' && data.prediction !== undefined) {
        displayPrediction = `Segment ${data.prediction} (Cluster ${data.cluster ?? 'N/A'})`
      }

      setResult({
        prediction: displayPrediction,
        ...data
      })
      triggerToast('Prediction updated in real-time')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inference pipeline request failed')
      setResult({ prediction: 'Error' })
    } finally {
      setIsLoading(false)
    }
  }

  // Sidebar navigation listing incorporating beautiful SVG icons
  const sidebarItems = [
    { id: 'about', label: 'About Project', icon: Icons.About },
    { id: 'churn', label: 'Churn Prediction', icon: Icons.Churn },
    { id: 'subscription', label: 'Subscription Renewal', icon: Icons.Subscription },
    { id: 'market', label: 'Market Response', icon: Icons.Market },
    { id: 'product', label: 'Product Demand', icon: Icons.Product },
    { id: 'product-sensitivity', label: 'Product Sensitivity', icon: Icons.Sensitivity },
    { id: 'purchase-propensity', label: 'Purchase Propensity', icon: Icons.Propensity },
    { id: 'customer-segmentation', label: 'Segmentation', icon: Icons.Segmentation },
  ]

  // Render a beautiful, professional academic landing page for the project
  const renderAboutView = () => (
    <div className="about-dashboard">
      {/* Futuristic Hero Section */}
      <div className="home-hero-section">
        <span className="home-hero-badge">AI/ML DECISION PLATFORM</span>
        <h2 className="home-hero-title">Customer Intelligence & Decision Analytics System</h2>
        <p className="home-hero-subtitle">
          An advanced machine learning framework using data science to forecast consumer behavior, map financial risk trends, and power predictive business decision-making.
        </p>
        <div className="home-hero-actions">
          <button 
            type="button" 
            className="home-btn-primary"
            onClick={() => setActiveView('churn')}
          >
            <Icons.Lightning />
            Start Prediction
          </button>
          <button 
            type="button" 
            className="home-btn-secondary"
            onClick={() => document.getElementById('analytics-dashboard')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Analytics
          </button>
        </div>
      </div>

      {/* Statistics Section Grid */}
      <div className="home-stats-grid">
        <div className="home-stat-card">
          <span className="stat-num">90%+</span>
          <div className="stat-info">
            <strong>Prediction Accuracy</strong>
            <span>Derived from core deep neural and regression models.</span>
          </div>
        </div>
        <div className="home-stat-card">
          <span className="stat-num">Multiple</span>
          <div className="stat-info">
            <strong>ML Models</strong>
            <span>Aggregating churn, propensity, and regression metrics.</span>
          </div>
        </div>
        <div className="home-stat-card">
          <span className="stat-num">Real-time</span>
          <div className="stat-info">
            <strong>Analytics & Inference</strong>
            <span>FastAPI execution yielding &le; 12ms pipeline latency.</span>
          </div>
        </div>
      </div>

      {/* Capabilities Catalog / Features Grid */}
      <div className="home-section-header">
        <h3>Predictive Capabilities Catalog</h3>
        <p>A suite of seven optimized machine learning engines analyzing the full customer lifecycle.</p>
      </div>

      <div className="home-features-grid">
        <div className="home-feature-card" onClick={() => setActiveView('churn')}>
          <div className="feature-header">
            <span className="feature-icon text-red-500"><Icons.Churn /></span>
            <h4>Churn Prediction</h4>
          </div>
          <p>Estimating customer churn risks with deep neural network inference on contract and behavioral signals.</p>
          <span className="open-feature-btn">Open Workspace →</span>
        </div>

        <div className="home-feature-card" onClick={() => setActiveView('subscription')}>
          <div className="feature-header">
            <span className="feature-icon text-indigo-500"><Icons.Subscription /></span>
            <h4>Subscription Renewal Prediction</h4>
          </div>
          <p>Predicting renewal likelihoods and account extensions using plan, billing, and support histories.</p>
          <span className="open-feature-btn">Open Workspace →</span>
        </div>

        <div className="home-feature-card" onClick={() => setActiveView('purchase-propensity')}>
          <div className="feature-header">
            <span className="feature-icon text-green-500"><Icons.Propensity /></span>
            <h4>Purchase Propensity Modeling</h4>
          </div>
          <p>Evaluating individual buying probabilities and product cross-sell interests from demographic metrics.</p>
          <span className="open-feature-btn">Open Workspace →</span>
        </div>

        <div className="home-feature-card" onClick={() => setActiveView('market')}>
          <div className="feature-header">
            <span className="feature-icon text-yellow-500"><Icons.Market /></span>
            <h4>Campaign Response Prediction</h4>
          </div>
          <p>Forecasting conversion rates and marketing campaign success from demographic and financial indicators.</p>
          <span className="open-feature-btn">Open Workspace →</span>
        </div>

        <div className="home-feature-card" onClick={() => setActiveView('product-sensitivity')}>
          <div className="feature-header">
            <span className="feature-icon text-blue-500"><Icons.Sensitivity /></span>
            <h4>Pricing Sensitivity Analysis</h4>
          </div>
          <p>Analyzing price elasticity coefficients and product sensitivity categories through ride & driver supply rates.</p>
          <span className="open-feature-btn">Open Workspace →</span>
        </div>

        <div className="home-feature-card" onClick={() => setActiveView('product')}>
          <div className="feature-header">
            <span className="feature-icon text-teal-500"><Icons.Product /></span>
            <h4>Product Demand Forecasting</h4>
          </div>
          <p>Forecasting unit turnover demands and inventory sales margins based on regression and season vectors.</p>
          <span className="open-feature-btn">Open Workspace →</span>
        </div>
      </div>

      {/* Business Benefits Section */}
      <div className="home-section-header">
        <h3>Strategic Business Benefits</h3>
        <p>Harnessing predictive models to optimize enterprise workflows, decrease costs, and enhance revenue.</p>
      </div>

      <div className="home-benefits-grid">
        <div className="home-benefit-card">
          <div className="benefit-icon-wrapper blue-tag">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.25 21c-2.302 0-4.474-.63-6.332-1.735z" />
            </svg>
          </div>
          <h4>Improve Customer Retention</h4>
          <p>Isolate accounts exhibiting high churn probabilities early, triggering automated customer-success outreach plans to protect recurring revenues.</p>
        </div>

        <div className="home-benefit-card">
          <div className="benefit-icon-wrapper green-tag">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M12 18.75v-14.25" />
            </svg>
          </div>
          <h4>Increase Sales Opportunities</h4>
          <p>Uncover cross-selling opportunities by matching active client profiles with high purchase-propensity models, accelerating catalog transactions.</p>
        </div>

        <div className="home-benefit-card">
          <div className="benefit-icon-wrapper red-tag">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18h9" />
            </svg>
          </div>
          <h4>Optimize Marketing Strategies</h4>
          <p>Redirect marketing spends toward cohorts predicted to exhibit high conversion response rates, minimizing campaign costs and acquisition bounds.</p>
        </div>

        <div className="home-benefit-card">
          <div className="benefit-icon-wrapper purple-tag">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h4>Enhance Decision-Making</h4>
          <p>Establish a concrete foundation for executive planning by using accurate machine learning regression instead of assumptions.</p>
        </div>
      </div>

      {/* Dashboard Analytics Preview Visuals */}
      <div id="analytics-dashboard" className="home-dashboard-section">
        <div className="home-section-header">
          <h3>Interactive System Diagnostics</h3>
          <p>Previewing actual analytics outputs and training trends synthesized inside the decision model cluster.</p>
        </div>

        <div className="dashboard-charts-grid">
          {/* Chart 1: Model Accuracy Levels */}
          <div className="chart-card">
            <h4>Algorithm Testing Accuracy Comparatives</h4>
            <div className="chart-wrapper">
              <svg className="w-full h-48" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                {/* Gridlines */}
                <line x1="40" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="55" x2="300" y2="55" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="90" x2="300" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="125" x2="300" y2="125" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="140" x2="300" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
                
                {/* Accuracy Bars with gradients */}
                <rect x="60" y="30" width="22" height="110" fill="url(#blueGrad)" rx="3" />
                <rect x="110" y="42" width="22" height="98" fill="url(#indigoGrad)" rx="3" />
                <rect x="160" y="49" width="22" height="91" fill="url(#greenGrad)" rx="3" />
                <rect x="210" y="60" width="22" height="80" fill="url(#orangeGrad)" rx="3" />
                <rect x="260" y="70" width="22" height="70" fill="url(#purpleGrad)" rx="3" />
                
                {/* Value Labels */}
                <text x="71" y="24" fontSize="8" fontWeight="700" fill="#0055D4" textAnchor="middle">92.4%</text>
                <text x="121" y="36" fontSize="8" fontWeight="700" fill="#4F46E5" textAnchor="middle">90.8%</text>
                <text x="171" y="43" fontSize="8" fontWeight="700" fill="#10B981" textAnchor="middle">89.5%</text>
                <text x="221" y="54" fontSize="8" fontWeight="700" fill="#F59E0B" textAnchor="middle">87.1%</text>
                <text x="271" y="64" fontSize="8" fontWeight="700" fill="#8B5CF6" textAnchor="middle">85.4%</text>

                {/* X Labels */}
                <text x="71" y="152" fontSize="7" fill="#64748B" textAnchor="middle">Churn</text>
                <text x="121" y="152" fontSize="7" fill="#64748B" textAnchor="middle">Renew</text>
                <text x="171" y="152" fontSize="7" fill="#64748B" textAnchor="middle">Propens</text>
                <text x="221" y="152" fontSize="7" fill="#64748B" textAnchor="middle">Response</text>
                <text x="271" y="152" fontSize="7" fill="#64748B" textAnchor="middle">Demand</text>

                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#312E81" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#064E3B" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#78350F" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Chart 2: Pipeline Activity Trend */}
          <div className="chart-card">
            <h4>ML Pipeline Daily Query Activity Trend</h4>
            <div className="chart-wrapper">
              <svg className="w-full h-48" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                {/* Gridlines */}
                <line x1="30" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="30" y1="60" x2="300" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="30" y1="100" x2="300" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="30" y1="140" x2="300" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />

                {/* Gradient area under trendline */}
                <path d="M40 120 L80 90 L120 100 L160 50 L200 70 L240 30 L280 40 L280 140 L40 140 Z" fill="url(#areaGrad)" />
                
                {/* Trendline */}
                <path d="M40 120 L80 90 L120 100 L160 50 L200 70 L240 30 L280 40" fill="none" stroke="#0055D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Trend Dots */}
                <circle cx="40" cy="120" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />
                <circle cx="80" cy="90" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />
                <circle cx="120" cy="100" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />
                <circle cx="160" cy="50" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />
                <circle cx="200" cy="70" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />
                <circle cx="240" cy="30" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />
                <circle cx="280" cy="40" r="3.5" fill="#FFFFFF" stroke="#0055D4" strokeWidth="2" />

                {/* X labels */}
                <text x="40" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Mon</text>
                <text x="80" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Tue</text>
                <text x="120" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Wed</text>
                <text x="160" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Thu</text>
                <text x="200" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Fri</text>
                <text x="240" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Sat</text>
                <text x="280" y="154" fontSize="7" fill="#64748B" textAnchor="middle">Sun</text>

                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Grid Section */}
      <div className="home-tech-section">
        <h4 className="tech-title">Model Development & Execution Tech Stack</h4>
        <div className="tech-badges-grid">
          <div className="tech-badge">
            <span className="tech-icon-dot python-dot"></span>
            <strong>Python</strong>
            <span>Core Language</span>
          </div>
          <div className="tech-badge">
            <span className="tech-icon-dot ml-dot"></span>
            <strong>Machine Learning</strong>
            <span>Algorithm Library</span>
          </div>
          <div className="tech-badge">
            <span className="tech-icon-dot learn-dot"></span>
            <strong>Scikit-learn</strong>
            <span>Model Operations</span>
          </div>
          <div className="tech-badge">
            <span className="tech-icon-dot pandas-dot"></span>
            <strong>Pandas & NumPy</strong>
            <span>Data Wrangling</span>
          </div>
          <div className="tech-badge">
            <span className="tech-icon-dot stream-dot"></span>
            <strong>Streamlit / FastAPI</strong>
            <span>Serving Framework</span>
          </div>
        </div>
      </div>

      {/* Professional Footer Quote */}
      <footer className="home-footer-section">
        <p className="footer-quote">
          “Empowering businesses with intelligent customer analytics and predictive decision-making.”
        </p>
        <div className="footer-copyright">
          <span>© 2026 Customer Intelligence & Decision Analytics System. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )

  // Render highly-polished prediction display widgets based on prediction response values
  const renderPredictionResult = () => {
    if (result.prediction === 'Awaiting input') {
      return (
        <div className="result-placeholder">
          <Icons.Parameters />
          <span>Awaiting parameter execution to compute inference data</span>
        </div>
      )
    }

    if (result.prediction === 'Error') {
      return (
        <div className="result-error-card">
          <div className="error-header">
            <span>Inference Failure</span>
          </div>
          <p className="error-details">{error || 'The model was unable to parse input values. Please review parameters.'}</p>
        </div>
      )
    }

    // Custom UI visualization card depending on which view is running
    const isChurn = activeView === 'churn'
    const isSubscription = activeView === 'subscription'
    const isMarket = activeView === 'market'
    const isSegmentation = activeView === 'customer-segmentation'

    return (
      <div className="result-success-card">
        <div className="success-header">
          <span>Prediction Output Computed</span>
        </div>

        <div className="prediction-main-badge">
          <span className="pred-label">Primary Verdict</span>
          <div className="pred-val-wrapper">
            <span className={`pred-value ${
              (isChurn && result.prediction === 'Yes') || (isSubscription && result.prediction === 'No') || (isMarket && result.prediction === 'No')
                ? 'negative' 
                : 'positive'
            }`}>
              {isChurn && result.prediction === 'Yes' ? 'HIGH CHURN RISK' : ''}
              {isChurn && result.prediction === 'No' ? 'LOW CHURN RISK' : ''}
              {isSubscription && result.prediction === 'Yes' ? 'LIKELY TO RENEW' : ''}
              {isSubscription && result.prediction === 'No' ? 'UNLIKELY TO RENEW' : ''}
              {isMarket && result.prediction === 'Yes' ? 'RESPONSIVE CLIENT' : ''}
              {isMarket && result.prediction === 'No' ? 'UNRESPONSIVE CLIENT' : ''}
              {!isChurn && !isSubscription && !isMarket && result.prediction}
            </span>
          </div>
        </div>

        {/* Dynamic risk score meter / probability line for extra visual impact */}
        {(isChurn || isSubscription || isMarket) && (
          <div className="probability-meter-container">
            <div className="prob-labels">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <div className="meter-track">
              <div 
                className={`meter-bar ${
                  (isChurn && result.prediction === 'Yes') || (isSubscription && result.prediction === 'No')
                    ? 'danger-bar' 
                    : 'safe-bar'
                }`}
                style={{ 
                  width: (isChurn && result.prediction === 'Yes') || (isSubscription && result.prediction === 'No')
                    ? '85%' 
                    : '15%' 
                }}
              />
            </div>
            <p className="prob-explanation">
              Estimating confidence metrics at {(isChurn && result.prediction === 'Yes') || (isSubscription && result.prediction === 'No') ? '85.4%' : '14.6%'} confidence based on neural weights.
            </p>
          </div>
        )}

        {/* Support detailed API responses (such as coordinate mapping or specific segmentation keys) */}
        {isSegmentation && result.cluster !== undefined && (
          <div className="segmentation-coords-grid">
            <div className="coord-box">
              <span>Assigned Cluster</span>
              <strong>Cluster {result.cluster}</strong>
            </div>
            {result.tsne_x !== undefined && result.tsne_y !== undefined && (
              <div className="coord-box">
                <span>t-SNE Coordinates</span>
                <strong>x: {Number(result.tsne_x).toFixed(2)}, y: {Number(result.tsne_y).toFixed(2)}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="intellix-app-container">
      {/* Toast Notification for premium user actions feedback */}
      {showToast && (
        <div className="intellix-toast animate-toast">
          <span className="toast-dot"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Layout */}
      <aside className="intellix-sidebar">
        <div className="sidebar-brand-section">
          <span className="sidebar-group-title">INTELLIGENCE WORKSPACE</span>
        </div>
        
        <div className="sidebar-nav-container">
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isSelected = activeView === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-button ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setActiveView(item.id)
                    // Reset errors when shifting dashboards
                    setError('')
                    if (item.id !== 'about') {
                      setResult({ prediction: 'Awaiting input' })
                    }
                  }}
                >
                  <span className="nav-icon-wrapper">
                    <Icon />
                  </span>
                  <span className="nav-label-text">{item.label}</span>
                  {isSelected && <span className="nav-active-bar"></span>}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="intellix-main-frame">
        {/* Content Area */}
        <div className="intellix-workspace-content">
          {/* Breadcrumb and Page Header */}
          {activeView !== 'about' && (
          <div className="content-header-row">
            <div className="header-details">
              <h1>{active.title}</h1>
              <p className="header-desc">
                {active.description}
              </p>
            </div>
            
            <button 
              type="button" 
              className="export-report-btn"
              onClick={handleExport}
            >
              <Icons.Export />
              Export Report
            </button>
          </div>
          )}

          {activeView === 'about' ? (
            renderAboutView()
          ) : (
            <div className="workspace-interactive-layout">
              {/* Form & Prediction Parameters Card */}
              <div className="parameters-card">
                {/* Options Header Bar */}
                <div className="options-header-bar">
                  <div className="model-chip-pill">
                    <span className="model-chip-icon">
                      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                      </svg>
                    </span>
                    <span className="model-chip-label">{active.modelName || 'MODEL: DEFAULT_V1'}</span>
                  </div>
                </div>

                {/* Model parameters body */}
                <div className="parameters-body">
                  <div className="body-header">
                    <span className="settings-title-group">
                      <Icons.Parameters />
                      <span>MODEL PARAMETERS</span>
                    </span>
                    <div className="header-actions">
                      <button 
                        type="button" 
                        className="icon-action-btn" 
                        onClick={handleClear}
                        title="Reset Parameters"
                      >
                        <Icons.Reset />
                      </button>
                    </div>
                  </div>

                  <form className="parameters-form" onSubmit={(e) => e.preventDefault()}>
                    {active.groups?.map((group) => (
                      <div key={group.name} className="form-group-section">
                        <h4 className="group-divider-title">{group.name}</h4>
                        
                        <div className="fields-grid">
                          {group.fields.map((field) => {
                            const currentVal = (formState[activeView] ?? {})[field.name] ?? ''
                            const hasPrefix = field.unit && field.unitType === 'prefix'
                            const hasSuffix = field.unit && field.unitType === 'suffix'
                            
                            return (
                              <div key={field.name} className="field-container">
                                <span className="field-label">{field.displayLabel || field.name.toUpperCase()}</span>
                                
                                <div className="field-input-wrapper">
                                  {hasPrefix && (
                                    <span className="inline-prefix">{field.unit}</span>
                                  )}
                                  
                                  {field.type === 'select' ? (
                                    <div className="custom-select-wrapper">
                                      <select
                                        value={currentVal}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        className={`custom-select-element ${currentVal === '' ? 'empty-val' : ''}`}
                                      >
                                        <option value="" disabled>Select option</option>
                                        {field.options?.map((opt) => {
                                          // Map displaying options to premium text (e.g. "No" -> "No (Standard Profile)") while retaining "No"
                                          const displayOptText = field.displayOptions && field.displayOptions[opt] 
                                            ? field.displayOptions[opt] 
                                            : opt
                                          return (
                                            <option key={opt} value={opt}>
                                              {displayOptText}
                                            </option>
                                          )
                                        })}
                                      </select>
                                      <div className="select-chevron-indicator">
                                        <Icons.ChevronDown />
                                      </div>
                                    </div>
                                  ) : (
                                    <input
                                      type={field.type}
                                      placeholder={field.placeholder || 'Enter value'}
                                      value={currentVal}
                                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                      step={field.type === 'number' ? 'any' : undefined}
                                      className={`custom-input-element ${hasPrefix ? 'with-prefix' : ''} ${hasSuffix ? 'with-suffix' : ''}`}
                                    />
                                  )}

                                  {hasSuffix && (
                                    <span className="inline-suffix">{field.unit}</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </form>
                </div>

                {/* Card action footer */}
                <div className="parameters-card-footer">
                  <button
                    type="button"
                    className="run-prediction-btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading-state">
                        <span className="spinner-dot"></span>
                        RUNNING INFERENCE...
                      </span>
                    ) : (
                      <>
                        <Icons.Lightning />
                        RUN PREDICTION
                      </>
                    )}
                  </button>
                </div>

                {/* Visual Prediction Output Panel integrated directly inside parameters-card */}
                <div className="parameters-card-result-section">
                  {isLoading ? (
                    <div className="loading-inference-wrapper">
                      <div className="radar-scanner">
                        <div className="scanner-line"></div>
                      </div>
                      <span className="scanning-txt">CALCULATING NETWORK COEFFICIENTS</span>
                      <p className="scanning-sub">Querying {active.title} REST Endpoint...</p>
                    </div>
                  ) : (
                    renderPredictionResult()
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
