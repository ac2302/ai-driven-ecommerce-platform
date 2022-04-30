import pickle
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
import nltk
import re

nltk.download('stopwords')

with open('spam_filter/model.pkl', 'rb') as f:
    model = pickle.load(f)


def filter(review):

    review = re.sub('[^a-zA-Z]', ' ', review)
    review = review.lower()
    review = review.split()
    ps = PorterStemmer()
    all_stopwords = stopwords.words('english')
    all_stopwords.remove('not')
    review = [ps.stem(word)
              for word in review if not word in set(all_stopwords)]
    review = ' '.join(review)

    vectors = model['cv'].transform([review]).toarray()

    result = model['classifier'].predict(vectors)[0]

    if result == 0:
        return {'spam': False}
    else:
        return {'spam': True}
