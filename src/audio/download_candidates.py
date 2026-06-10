import os
import urllib.request

candidates = {
    'incorrect': [2042, 954, 950, 472, 2939, 240, 1540],
    'gameover': [2941, 568, 571, 2960, 3053],
    'swoosh': [166, 1152, 1153, 1154, 1475]
}

out_dir = '/Users/maaren/TaalSwipe/assets/sounds/candidates'
os.makedirs(out_dir, exist_ok=True)

for category, ids in candidates.items():
    for id_val in ids:
        url = f'https://assets.mixkit.co/active_storage/sfx/{id_val}/{id_val}.wav'
        dest = os.path.join(out_dir, f'{category}_{id_val}.wav')
        print(f'Downloading {category} {id_val} from {url}...')
        try:
            urllib.request.urlretrieve(url, dest)
            print(f'Saved to {dest}')
        except Exception as e:
            print(f'Failed to download {id_val}: {e}')
