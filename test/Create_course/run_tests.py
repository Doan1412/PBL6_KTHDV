import test_search
import test_filters
import test_add_course

if __name__ == "__main__":
    test_search.test_search_and_save_screenshot()
    test_filters.test_filters_and_save_screenshot()
    test_add_course.run_tests()
