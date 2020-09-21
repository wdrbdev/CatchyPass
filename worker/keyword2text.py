from aitextgen import aitextgen
from aitextgen.utils import GPT2ConfigCPU


def keyword2text(keywords):
    # Initialize aitextgen
    config_path = './data/catchypass/trained_model/config.json'
    model_path = './data/catchypass/trained_model/pytorch_model.bin'
    ai = aitextgen(model=model_path, config=config_path)

    keyword = keywords.lower()  # keyword = " ".join(keywords).lower()
    N_RETRY = 0
    retry_count = 0
    prefix = f'#{keyword}:'
    while retry_count <= N_RETRY:
        texts = ai.generate(n=1,
                            prompt=prefix,
                            max_length=256,
                            temperature=1.0,
                            return_as_list=True)
        for text in texts:
            text = text.replace(" <|n|> ", "\n")
            if text.lower().find(keyword) != -1:
                return text.replace(prefix + " ", "")
        retry_count = retry_count + 1

    text = ai.generate(n=1, prompt=prefix, max_length=256,
                       return_as_list=True)[0]
    return text.replace(" <|n|> ", "\n").replace(prefix + " ", "")
