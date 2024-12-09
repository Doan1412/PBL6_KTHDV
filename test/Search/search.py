from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from openpyxl import Workbook
from openpyxl.drawing.image import Image as ExcelImage
from io import BytesIO
from PIL import Image
import time

wb = Workbook()
ws = wb.active
ws.title = "Search Results"
ws.append(["Step", "Description", "Number of Results", "Screenshot"])

driver = webdriver.Chrome()
driver.maximize_window()

url = "http://localhost:3000/en"
driver.get(url)

try:
  time.sleep(5)

  def add_screenshot_to_excel(step, description, num_results):
    screenshot = driver.get_screenshot_as_png()
    image = Image.open(BytesIO(screenshot))
    
    max_width, max_height = 300, 200
    image.thumbnail((max_width, max_height))

    img_io = BytesIO()
    image.save(img_io, format="PNG")
    img_io.seek(0)
    excel_image = ExcelImage(img_io)
    img_name = f"Step {step}.png"

    ws.append([step, description, num_results])
    img_row = ws.max_row
    ws.add_image(excel_image, f"D{img_row}")

  search_input = driver.find_element(By.CSS_SELECTOR, "input[type='search']")
  search_input.send_keys("Online")
  search_input.send_keys(Keys.RETURN)
  time.sleep(5)

  elements = driver.find_elements(By.CLASS_NAME, "bg-card")
  num_results = len(elements)
  print(f"Số lượng kết quả search: {num_results}")

  add_screenshot_to_excel(1, "Search 'Online'", num_results)

  level_button = driver.find_element(By.XPATH, "//button[.//span[contains(text(), 'Select level')]]")
  level_button.click()
  level_option = driver.find_element(By.XPATH, f"//div[@role='option' and .//span[text()='N1']]")
  level_option.click()
  time.sleep(5)

  elements = driver.find_elements(By.CLASS_NAME, "bg-card")
  num_results = len(elements)
  print(f"Số lượng kết quả filter level: {num_results}")

  add_screenshot_to_excel(2, "Filter by Level: N1", num_results)

  category_button = driver.find_element(By.XPATH, "//button[.//span[contains(text(), 'Select category')]]")
  category_button.click()
  category_option = driver.find_element(By.XPATH, f"//div[@role='option' and .//span[text()='Japanese Culture']]")
  category_option.click()
  time.sleep(5)

  elements = driver.find_elements(By.CLASS_NAME, "bg-card")
  num_results = len(elements)
  print(f"Số lượng kết quả filter category: {num_results}")

  add_screenshot_to_excel(3, "Filter by Category: Japanese Culture", num_results)

  sort_button = driver.find_element(By.XPATH, "//button[.//span[contains(text(), 'Sort by')]]")
  sort_button.click()
  sort_option = driver.find_element(By.XPATH, f"//div[@role='option' and .//span[text()='Latest']]")
  sort_option.click()
  time.sleep(5)

  elements = driver.find_elements(By.CLASS_NAME, "bg-card")
  num_results = len(elements)
  print(f"Số lượng kết quả filter sort: {num_results}")

  add_screenshot_to_excel(4, "Sort by: Latest", num_results)

except Exception as e:
  print(f"Kiểm tra thất bại: {e}")

finally:
  excel_path = "test/Search/search_results_with_images.xlsx"
  wb.save(excel_path)
  print(f"Kết quả đã được lưu tại {excel_path}")
  driver.quit()
