from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from base import setup_driver
import time
import pandas as pd

def read_course_data(file_path):
  df = pd.read_excel(file_path)
  return df

def write_result_to_excel(result_data, result_file_path):
  result_df = pd.DataFrame(result_data)
  result_df.to_excel(result_file_path, index=False)

def test_add_course(course_data, expected_result):
  driver = setup_driver()
  result = "Fail"

  try:
    title = course_data['Title']
    description = course_data['Description']
    category = course_data['Category']
    level = course_data['Level']
    image_path = course_data['Image Path']

    time.sleep(1)
    add_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Create Request')]")
    add_button.click()
    time.sleep(1)

    if pd.notna(title):
      title_input = driver.find_element(By.XPATH, "//input[@placeholder='Course Title']")
      title_input.send_keys(title)

    if pd.notna(description):
      description_input = driver.find_element(By.XPATH, "//textarea[@placeholder='Course Description']")
      description_input.send_keys(description)

    if pd.notna(category):
      category_dropdown = driver.find_element(By.XPATH, "//button[.//span[contains(text(), 'Categories')]]")
      category_dropdown.click()
      category_option = driver.find_element(By.XPATH, f"//div[@role='option' and .//span[text()='{category}']]")
      category_option.click()

    if pd.notna(level):
      level_dropdown = driver.find_element(By.ID, "select-level")
      level_dropdown.click()
      level_option = driver.find_element(By.XPATH, f"//div[@role='option' and .//span[text()='{level}']]")
      driver.execute_script("arguments[0].click();", level_option)

    if pd.notna(image_path):
      upload_button = driver.find_element(By.XPATH, "//label[contains(text(), 'Upload')]")
      upload_button.click()
      iframe = driver.find_element(By.XPATH, "//iframe[@data-test='uw-iframe']")
      driver.switch_to.frame(iframe)
      time.sleep(1)

      file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
      file_input.send_keys(image_path)

      time.sleep(10)
      driver.switch_to.default_content()

    submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
    submit_button.click()
    time.sleep(3)

    try:
      success_message = driver.find_element(By.XPATH, "//div[contains(text(), 'Success!')]")
      if success_message:
        result = "Pass" if expected_result == "Success" else "Fail"
    except:
      success_message = None

    try:
      failure_message = driver.find_element(By.XPATH, "//div[contains(text(), 'Uh oh! Something went wrong. Retry again!')]")
      if failure_message:
        result = "Pass" if expected_result == "Fail" else "Fail"
    except:
      failure_message = None

    print(f"Result for course '{title}': {result}")

  finally:
    driver.quit()

  return {
    'Title': title,
    'Description': description,
    'Category': category,
    'Level': level,
    'Image Path': image_path,
    'Expected Result': expected_result,
    'Testcase status': result
  }

def run_tests():
  file_path = "test/Create_course/data/course_data.xlsx"
  result_file_path = "test/Create_course/results/create_course_result.xlsx"
  course_data = read_course_data(file_path)
  results = []

  for index, course in course_data.iterrows():
    print(f"Running test for course: {course['Title']}")
    expected_result = course['Expected Result']
    result_data = test_add_course(course, expected_result)
    results.append(result_data)

  write_result_to_excel(results, result_file_path)
