import json
from collections import Counter

N_GRAM = 4
JSON_INPUT_PATH = 'rhymebuster.json'
# JSON_INPUT_PATH = 'dataset.json'
JSON_OUTPUT_PATH = f'duplication({N_GRAM} words).json'

duplicate_words = []
with open(JSON_INPUT_PATH) as json_input:
    data = list(json.load(json_input))
    for data_index_1 in range(len(data)):
        words = list(data[data_index_1]['sentence'].split())
        for i in range(len(words) - N_GRAM + 1):
            count = 0
            continuous_word = " ".join(words[i:i + N_GRAM])
            for data_index_2 in range(len(data)):
                if data_index_1 == data_index_2:
                    break
                if data[data_index_2]['sentence'].find(continuous_word) != -1:
                    count = count + 1
            if count > 0:
                duplicate_words.append(continuous_word)

counter = Counter(duplicate_words)
print(counter)
for element in counter.elements():
    del element
print(counter)

# with open(JSON_OUTPUT_PATH, 'w') as json_output:
#     json_output.write(json.dumps(counter))