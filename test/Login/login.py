from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd
import time

test_data = pd.read_excel("test/Login/login_test_data.xlsx")

driver = webdriver.Chrome()

login_url = "http://localhost:3000/en/login"
home_url = "http://localhost:3000/en"

def test_login(email, password):
  driver.get(login_url)
  time.sleep(2)

  try:
    email_field = driver.find_element(By.ID, "email")
    email_field.clear()
    if email and pd.notna(email):
      email_field.send_keys(email)

    password_field = driver.find_element(By.ID, "password")
    password_field.clear()
    if password and pd.notna(password):
      password_field.send_keys(password)

    login_button = driver.find_element(By.TAG_NAME, "button")
    login_button.click()

    time.sleep(7)

    current_url = driver.current_url
    print(f"URL hiện tại: {current_url}")
    if current_url == home_url:
      return "Success"
    else:
      return "Failed"
  except Exception as e:
    print(f"Lỗi khi thực hiện test: {e}")
    return "Failed"

results = []
for index, row in test_data.iterrows():
  email = row["email"]
  password = row["password"]
  expected_result = row["expected_result"]
  description = row["input_description"]
  
  print(f"Đang test: {description}")
  result = test_login(email, password)
  results.append({
    "email": email,
    "password": password,
    "expected_result": expected_result,
    "actual_result": result,
    "test_passed": result == expected_result
  })

results_df = pd.DataFrame(results)
results_df.to_excel("test/Login/login_test_results.xlsx", index=False)

print("Kết quả test đã được lưu vào file 'login_test_results.xlsx'.")

driver.quit()
