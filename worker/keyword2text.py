from aitextgen import aitextgen
from aitextgen.utils import GPT2ConfigCPU


def keyword2text(keywords):
    config_path = './data/catchypass/trained_model/config.json'
    model_path = './data/catchypass/trained_model/pytorch_model.bin'
    ai = aitextgen(model=model_path, config=config_path)

    keyword = " ".join(keywords).lower()
    prefix = f"#{keyword}"
    N_RETRY = 0
    retry_count = 0
    while retry_count <= N_RETRY:
        texts = ai.generate(n=1,
                            prompt=prefix,
                            max_length=256,
                            temperature=1.0,
                            return_as_list=True)
        for text in texts:
            text = "\n".join(text.split(" <|n|> ")[1:])
            if text.lower().find(keyword) != -1:
                return text
        retry_count = retry_count + 1

    text = ai.generate(n=1, prompt=prefix, max_length=256,
                       return_as_list=True)[0]
    return "\n".join(text.split(" <|n|> ")[1:])
