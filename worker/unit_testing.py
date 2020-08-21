import unittest
from keyword2text import keyword2text


class TestLimerickGeneration(unittest.TestCase):
    # Limerick output should contains 5 lines according to limerick format
    def test_limerick_generation(self):
        limerick = keyword2text("flower")
        print(limerick)
        limerick_length = len(limerick.split("\n"))
        self.assertEqual(5, limerick_length)


if __name__ == '__main__':
    unittest.main()