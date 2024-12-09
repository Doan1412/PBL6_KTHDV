from selenium import webdriver

def setup_driver():
  TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImFjY291bnQiOjF9fQ.sS4gQNbl4eAwf_BTSkCrKU5SJHbGW2ll92hkPr-J4Gs"

  driver = webdriver.Chrome()
  driver.get("http://localhost:3000/en/teacher/courses")

  driver.add_cookie({
    'name': 'authToken',
    'value': TOKEN,
    'domain': 'localhost',
    'path': '/',
  })

  driver.refresh()

  return driver
