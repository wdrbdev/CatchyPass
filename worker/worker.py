import os
import time
import redis
import json
from aitextgen import aitextgen

# Get env vars
REDIS_HOST = os.environ['REDIS_HOST']
REDIS_PORT = os.environ['REDIS_PORT']
print(f'Connecting to {REDIS_HOST}@{REDIS_PORT}')

# Connect to redis
redis_client = redis.Redis(host=REDIS_HOST, port=int(REDIS_PORT))
pubsub = redis_client.pubsub()
pubsub.subscribe("keywords")

# test only
pubsub_sen = redis_client.pubsub()
pubsub_sen.subscribe(["sentence"])

# Initialize aitextgen
config_path = './data/catchypass/trained_model/config.json'
model_path = './data/catchypass/trained_model/pytorch_model.bin'
ai = aitextgen(model=model_path, config=config_path, to_gpu=False)


def keyword2text(keyword):
    N_RETRY = 1
    retry_count = 0

    prefix = f'@{keyword}~:'
    while retry_count <= N_RETRY:
        texts = ai.generate(n=3,
                            batch_size=3,
                            prompt=prefix,
                            max_length=256,
                            temperature=1.0)
        for text in texts:
            text = text.replace("<|n|>", "\n")
            if text.find(keyword) is not -1:
                return text
        retry_count = retry_count + 1
    return ai.generate(n=1, prompt=prefix, max_length=256, temperature=1.0)


def sentence_result():
    print("Start subcribing.")
    for item in pubsub.listen():
        print("receiving message from js: " + str(item))

        if item["type"] == "message" and item["channel"].decode(
        ) == "keywords":
            # TODO actions when receiving message
            data = eval(item["data"].decode())
            # TODO publish message when done
            redis_client.publish(
                "sentence",
                json.dumps({
                    "_id": data["_id"],
                    "sentenceResult": keyword2text(data['keywords']),
                    "status": "testing"
                }))


if __name__ == '__main__':
    print("Worker starts")
    pubsub_thread = Thread(target=sentence_result, args=())
    pubsub_thread.start()
    pubsub_thread.join()

    print("Worker terminates")