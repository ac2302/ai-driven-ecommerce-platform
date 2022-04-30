from apyori import apriori
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd


dataset = pd.read_csv('reccomendations/data.csv', header=None)
transactions = []


for i in range(len(dataset)):
    transactions.append([str(dataset.values[i, j]) for j in range(9)])

rules = apriori(transactions=transactions, min_support=0.003,
                min_confidence=0.2, min_lift=3, min_length=2, max_length=2)


results = list(rules)


def inspect(results):
    lhs = [tuple(result[2][0][0])[0] for result in results]
    rhs = [tuple(result[2][0][1])[0] for result in results]
    supports = [result[1] for result in results]
    confidences = [result[2][0][2] for result in results]
    lifts = [result[2][0][3] for result in results]
    return list(zip(lhs, rhs, supports, confidences, lifts))


resultsinDataFrame = pd.DataFrame(inspect(results), columns=[
                                  'Left Hand Side', 'Right Hand Side', 'Support', 'Confidence', 'Lift'])

pretty = []

for row in np.array(resultsinDataFrame):
    pretty.append({
        'item1': row[0],
        'item2': row[1],
        'support': row[2],
        'confidence': row[3],
        'lift': row[4],
    })


def get_rules():
    return pretty
