import eel
import numpy as np
import pickle

with open('model_pickle', 'rb') as f:
    loaded_data = pickle.load(f)

est = loaded_data['est']
mean_30y = loaded_data['mean_30y']
df_clean = loaded_data['df_clean']

@eel.expose
def glacier(year):
    X_sep = np.array([1, year, 9])
    AnomaliesSIE_sep = float(est.predict(X_sep))
    extent_sep = (AnomaliesSIE_sep * mean_30y[8] / 100) + mean_30y[8]
    extent_sep = round(extent_sep, 3)

    extent_sep1979 = df_clean[df_clean.Year == 1979].reset_index().loc[8, 'Extent']
    loss_SIE = round(extent_sep1979 - extent_sep, 3)

    return loss_SIE

eel.init('web')
eel.start('index.html', mode='default')