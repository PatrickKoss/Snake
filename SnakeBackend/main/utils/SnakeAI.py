import os
import pickle

import numpy as np
import pandas as pd
from sklearn import neighbors
from sklearn.model_selection import train_test_split

# from SnakeBackend.settings import STATIC_ROOT
#
# filename_SVM = os.path.join(STATIC_ROOT, 'main/data/SVMClassifier.sav')
# filename_KNeighbors = os.path.join(STATIC_ROOT, 'main/data/KNeighborsClassifier.sav')
# filename = os.path.join(STATIC_ROOT, 'main/data/LinearRegressionClassifier.sav')

# csv = os.path.join(STATIC_ROOT, 'main/data/snakeDataAll.csv')

module_dir = os.path.dirname(__file__)
filename_SVM = os.path.join(module_dir, '../static/main/data/SVMClassifier.sav')
filename_KNeighbors = os.path.join(module_dir, '../static/main/data/KNeighborsClassifier.sav')
filename = os.path.join(module_dir, '../static/main/data/LinearRegressionClassifier.sav')
csv = os.path.join(module_dir, '../static/main/data/snakeDataAll.csv')

df = pd.read_csv(csv, encoding="utf-8", index_col=False)

# drop all nan values
df.dropna(inplace=True)

# round all values
df = df.round(2)

# kick out bad data where the direction is blocked and the snake is moving to this direction
for index, row in df.iterrows():
    if row['current_direction_top_blocked'] == 1 and row['direction'] == 0:
        df.drop(index, inplace=True)
    if row['current_direction_right_blocked'] == 1 and row['direction'] == 1:
        df.drop(index, inplace=True)
    if row['current_direction_bottom_blocked'] == 1 and row['direction'] == 2:
        df.drop(index, inplace=True)
    if row['current_direction_left_blocked'] == 1 and row['direction'] == 3:
        df.drop(index, inplace=True)

# we want to predict the direction of the snake so X are the features
X = np.array(df.drop(['direction'], 1))
y = np.array(df['direction'])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# normalizing the data does not work as well as it should
# X_train = preprocessing.scale(X_train)
# X_test = preprocessing.scale(X_test)

# check different classifiers
# clfSVM = svm.SVC(kernel='poly', degree=10, C=4)
clfKNeighbors = neighbors.KNeighborsClassifier(n_neighbors=17, algorithm='auto', n_jobs=-1, weights='distance')
# clfLinearRegression = svm.SVR(kernel='poly', degree=8, gamma='auto')

# clfSVM.fit(X_train, y_train)
clfKNeighbors.fit(X_train, y_train)
# clfLinearRegression.fit(X_train, y_train)

# confidence = clfSVM.score(X_test, y_test)
confidence_KNeighbors = clfKNeighbors.score(X_test, y_test)
# confidence_LinearRegression = clfLinearRegression.score(X_test, y_test)
# print("SVM ", confidence)
print("KNeighbors ", confidence_KNeighbors)
# print("LinearRegression ", confidence_LinearRegression)

# pickle.dump(clfLinearRegression, open(filename, "wb"))

pickle.dump(clfKNeighbors, open(filename_KNeighbors, "wb"))

# pickle.dump(clfSVM, open(filename_SVM, "wb"))

example_measures = np.array([[80.54, 6.08, 1.0, -1.0, -1.0, 1.0, -1.0]])
example_measures = example_measures.reshape(len(example_measures), -1)
prediction = clfKNeighbors.predict(example_measures)
print(prediction)
