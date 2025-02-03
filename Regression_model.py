import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import MinMaxScaler
import pickle

# -----------------------------
# Step 1: Load the Data
# -----------------------------
df_big_companies = pd.read_csv("top_companies_financials.csv")
df_small_businesses = pd.read_csv("samll.csv")

# -----------------------------
# Step 2: Inspect and Clean Column Names
# -----------------------------
df_big_companies.columns = df_big_companies.columns.str.strip()
df_small_businesses.columns = df_small_businesses.columns.str.strip()

print("Big Companies Columns:", df_big_companies.columns.tolist())
print("Small Businesses Columns:", df_small_businesses.columns.tolist())

# -----------------------------
# Step 3: Rename Columns for Consistency
# -----------------------------
rename_map = {
    'Customer Acquisition Cost': 'CAC',
    'Retention Rate': 'Retention Rate'
}

# If 'Funding Received' is present but 'Funding Received ($)' isn't, rename it
if 'Funding Received' in df_small_businesses.columns and 'Funding Received ($)' not in df_small_businesses.columns:
    df_small_businesses.rename(columns={'Funding Received': 'Funding Received'}, inplace=True)

df_small_businesses.rename(columns=rename_map, inplace=True)

# -----------------------------
# Step 4: Fill Missing Values
# -----------------------------
for df in [df_big_companies, df_small_businesses]:
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())

# -----------------------------
# Step 5: Feature Selection (After Fixing Column Names)
# -----------------------------
X_small = df_small_businesses[['Revenue', 'Expenses', 'Funding Received', 'Employees',
                               'Industry Growth Rate', 'CAC', 'Retention Rate']]
y_small = df_small_businesses[['Recommended Machinery Investment', 'Recommended Marketing Budget']]

# -----------------------------
# Step 6: Feature Scaling
# -----------------------------
scaler = MinMaxScaler()

X_small_scaled = scaler.fit_transform(X_small)

# -----------------------------
# Step 7: Train-Test Split
# -----------------------------
X_train_small, X_test_small, y_train_small, y_test_small = train_test_split(X_small_scaled, y_small, test_size=0.2, random_state=42)

# -----------------------------
# Step 8: Train the Model
# -----------------------------
model_small = RandomForestRegressor(n_estimators=100, random_state=42)
model_small.fit(X_train_small, y_train_small)

# -----------------------------
# Step 9: Evaluate the Model
# -----------------------------
y_pred_small = model_small.predict(X_test_small)

mae_small = mean_absolute_error(y_test_small, y_pred_small)
rmse_small = np.sqrt(mean_squared_error(y_test_small, y_pred_small))

print(f"Small Businesses Model - MAE: {mae_small}, RMSE: {rmse_small}")

# -----------------------------
# Step 10: Predict for New Input Data
# -----------------------------
new_small_business = np.array([[500000, 300000, 200000, 50, 8.0, 500, 75]])
new_small_business_scaled = scaler.transform(new_small_business)

predicted_growth = model_small.predict(new_small_business_scaled)
print(f"Predicted Recommended Machinery Investment: ${predicted_growth[0][0]:,.2f}")
print(f"Predicted Recommended Marketing Budget: ${predicted_growth[0][1]:,.2f}")

# -----------------------------
# Step 11: Save the Trained Model
# -----------------------------
with open('small_business_growth_model.pkl', 'wb') as f:
    pickle.dump(model_small, f)
