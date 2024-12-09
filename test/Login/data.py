import pandas as pd

test_data = [
  {"email": "test123@gmail.com", "password": "Wrongpassword", "expected_result": "Failed", "input_description": "Correct email, wrong password"},
  {"email": "wrongemail@domain.com", "password": "ValidPassword123", "expected_result": "Failed", "input_description": "Incorrect email"},
  {"email": None, "password": "ValidPassword123", "expected_result": "Failed", "input_description": "Missing email"},
  {"email": "test123@gmail.com", "password": None, "expected_result": "Failed", "input_description": "Missing password"},
  {"email": "test123.com", "password": "ValidPassword123", "expected_result": "Failed", "input_description": "Invalid email format"},
  {"email": "test123@com", "password": "123abc", "expected_result": "Failed", "input_description": "Password too short"},
  {"email": "test123@gmail.com", "password": "ValidPassword123", "expected_result": "Success", "input_description": "Correct email and password"},
]

data = pd.DataFrame(test_data)

data.to_excel("test\Login\login_test_data.xlsx", index=False)

print("File Excel 'login_test_data.xlsx' đã được tạo thành công.")
