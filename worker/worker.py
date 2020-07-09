import os
import time
import redis
import json
from threading import Thread

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


def sentence_result():
    print("Start subcribing.")
    for item in pubsub.listen():
        print("receiving message from js: " + str(item))

        if item["type"] == "message" and item["channel"].decode(
        ) == "keywords":
            keywords = eval(item["data"].decode())["keywords"]
            d = {
                "keywords": keywords,
                "sentence": 'example sentence for ' + '+'.join(keywords)
            }
            redis_client.publish("sentence", json.dumps(d))


if __name__ == '__main__':
    print("Worker starts")
    pubsub_thread = Thread(target=sentence_result, args=())
    pubsub_thread.start()
    pubsub_thread.join()

    print("Worker terminates")