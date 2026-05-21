# ============================================================================
# Subscription Renewal Prediction Model
# Purpose: Build a logistic regression model to predict customer churn
# ============================================================================

# Import required libraries for data processing and machine learning
import pandas as pd  # Data manipulation and analysis
import numpy as np  # Numerical computing
from sklearn.model_selection import train_test_split  # Split data into train/test sets
from sklearn.preprocessing import LabelEncoder, StandardScaler  # Data preprocessing
from sklearn.linear_model import LogisticRegression  # Logistic regression model
import pickle  # Serialize/deserialize Python objects
import os  # Operating system interface

# ============================================================================
# STEP 1: Load the dataset from CSV file
# ============================================================================
try:
    # Resolve dataset path relative to this script so it works from any CWD.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.normpath(
        os.path.join(script_dir, "..", "processed_datasets", "subscription_renewal_data.csv")
    )
    # Read CSV file into a pandas DataFrame
    data = pd.read_csv(data_path)
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: subscription_renewal_data.csv file not found.")
    exit(1)
except pd.errors.EmptyDataError:
    # Handle case where CSV file is empty
    print("Error: The CSV file is empty.")
    exit(1)
except Exception as e:
    print(f"Error loading the dataset: {e}")
    exit(1)
# ============================================================================
# STEP 2: Encode categorical variables to numerical values
# ============================================================================
def encode_categorical(df):
    """
    Convert categorical (object) columns to numerical values using LabelEncoder.
    This allows string values to be processed by machine learning algorithms.
    
    Args:
        df: DataFrame with categorical columns to encode
        
    Returns:
        DataFrame with encoded categorical columns
    """
    try:
        # Iterate through all columns in the DataFrame
        for column in df.columns:
            # Check if column contains text/object data
            if df[column].dtype == 'object':
                # Initialize LabelEncoder for this column
                le = LabelEncoder()
                # Convert categorical values to numeric labels (0, 1, 2, ...)
                df[column] = le.fit_transform(df[column])
        return df
    except Exception as e:
        print(f"Error during categorical encoding: {e}")
        raise

try:
    # Apply categorical encoding to the dataset
    data = encode_categorical(data)
    print("Categorical encoding completed successfully.")
except Exception as e:
    print(f"Failed to encode categorical variables: {e}")
    exit(1)

# ============================================================================
# STEP 3: Separate features (X) and target variable (y)
# ============================================================================
try:
    # Remove 'Churn' column to get all feature columns (X)
    X = data.drop('Churn', axis=1)
    # Extract 'Churn' column as target variable (y) - what we want to predict
    y = data['Churn']
    print("Features and target variable separated successfully.")
except KeyError:
    # Error if 'Churn' column doesn't exist in dataset
    print("Error: 'Churn' column not found in the dataset.")
    exit(1)
except Exception as e:
    print(f"Error splitting features and target: {e}")
    exit(1)

# ============================================================================
# STEP 4: Split data into training and testing sets
# ============================================================================
try:
    # Split data: 80% for training, 20% for testing
    # random_state=42 ensures reproducible results
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print("Data split into training and testing sets successfully.")
except ValueError as e:
    # Error if data cannot be properly split
    print(f"Error: Invalid data for splitting - {e}")
    exit(1)
except Exception as e:
    print(f"Error splitting data: {e}")
    exit(1)
# ============================================================================
# STEP 5: Train the logistic regression model
# ============================================================================
try:
    # Create a logistic regression model instance
    # random_state=42 ensures reproducible results
    model = LogisticRegression(random_state=42)
    # Train the model using training data
    model.fit(X_train, y_train)
    print("Model trained successfully.")
except ValueError as e:
    # Error if training data is invalid or incompatible
    print(f"Error: Invalid data for model training - {e}")
    exit(1)
except Exception as e:
    print(f"Error during model training: {e}")
    exit(1)

# ============================================================================
# STEP 6: Evaluate model performance on test data
# ============================================================================
try:
    # Calculate accuracy score on test data (0 to 1, where 1 is perfect)
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy: {accuracy:.4f}")
except Exception as e:
    # Error if evaluation fails
    print(f"Error evaluating model: {e}")
    exit(1)
# ============================================================================
# STEP 7: Save the trained model to a file using pickle serialization
# ============================================================================
def save_model(model, filename):
    """
    Serialize and save the trained model to a file for future use.
    
    Args:
        model: Trained machine learning model to save
        filename: Path and name of the file to save the model to
        
    Raises:
        FileNotFoundError: If the directory doesn't exist
        IOError: If file cannot be written
        pickle.PicklingError: If model serialization fails
    """
    try:
        # Open file in binary write mode
        with open(filename, 'wb') as file:
            # Serialize the model object and write to file
            pickle.dump(model, file)
        print(f"Model saved successfully to {filename}")
    except FileNotFoundError:
        # Error if directory path doesn't exist
        print(f"Error: Directory for {filename} does not exist.")
        raise
    except IOError as e:
        # Error if file cannot be written (permissions, disk full, etc.)
        print(f"Error: Unable to write to {filename} - {e}")
        raise
    except pickle.PicklingError as e:
        # Error if model cannot be serialized
        print(f"Error: Failed to pickle the model - {e}")
        raise
    except Exception as e:
        # Catch any other unexpected errors
        print(f"Error saving model: {e}")
        raise

# Call save_model function to persist the trained model
try:
    save_model(model, '../models/subscription_renewal_model.pkl')
except Exception as e:
    # Exit if model cannot be saved
    print(f"Failed to save model: {e}")
    exit(1)
