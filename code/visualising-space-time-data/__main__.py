# ---
INTERACTIVE = True
NUM_COLORS = 64

# ---
import re
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.graph_objs as go
from copy import deepcopy
from imageio import imread
from matplotlib.pyplot import imshow
import subprocess
from tabulate import tabulate
from plotly.offline import plot


# ---
print("Loading terrain map... ", end='')
img = imread('images/Minimap_7.07.png') / 255
if INTERACTIVE:
    plt.figure(figsize = (10,10))
    imshow(img)
print("Success!")
print(f"Size: {img.shape[0]}x{img.shape[1]} {img.dtype}")
print()


# ---
print("Dithering terrain map using ImageMagick")
cmd = f'''convert images/Minimap_7.07.png \
    -crop 1000x940+10+30 \
    -resize 640000@ \
    +dither \
    -colors {NUM_COLORS} \
    images/Minimap_7.07_{NUM_COLORS}colors.png'''
cmd_args = re.split(r'\s+', cmd)
print(f"Running command `{' '.join(cmd_args)}`... ", end='')
result = subprocess.run(cmd_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
stdout_log = result.stdout.decode('utf-8')
stderr_log = result.stderr.decode('utf-8')
return_code = result.returncode
if return_code == 0:
    print("Success")
else:
    print("Failed")
    print(stdout_log)
    print(stderr_log)
print()


# ---
# Load and display
print(f"Loading {NUM_COLORS} colors terrain map... ", end='')
img = imread(f'images/Minimap_7.07_{NUM_COLORS}colors.png') / 255
if INTERACTIVE:
    plt.figure(figsize = (10,10))
    imshow(img)
print("Success!")
print(f"Size: {img.shape[0]}x{img.shape[1]} {img.dtype}")
print()


# ---
# Find colors
print("Finding unique colors in the terrain map... ", end='')
img_array = img[:, :, :3].reshape((img.shape[0] * img.shape[1], 3))
colors = np.unique(img_array, axis=0)
n_colors = colors.shape[0]
print("Success!")
print(f"Colors array: {colors.shape[0]}x{colors.shape[1]}")
print()

# Show colors
def show_colors(colors):
    # colors_matrix = np.reshape(colors, [4, n_colors // 4, 3])
    imshow(np.reshape(colors, (1, -1, 3)), aspect='auto')
    plt.xticks([])
    plt.yticks([])
    plt.gcf().set_size_inches(10, 1)
if INTERACTIVE: show_colors(colors)


# ---
print(f"Creating visualisation of the terrain... ", end='')
# Create a custom colormap
color_to_value = {tuple(color[:3]): i / (n_colors - 1) for i, color in enumerate(colors)}
my_cmap_ply = [(value, 'rgb({}, {}, {})'.format(*color)) for color, value in color_to_value.items()]

# Map pixels to values
fun_find_value = lambda x: color_to_value[tuple(x[:3])]
values = np.apply_along_axis(fun_find_value, 2, np.flipud(img))

# Display terrain
yy = np.linspace(0, 1, img.shape[0])
xx = np.linspace(0, 1, img.shape[1])
zz = np.zeros(img.shape[:2])

surf = go.Surface(
    x=xx, y=yy, z=zz,
    colorscale=my_cmap_ply,
    surfacecolor=values,
    showscale=False
)
fig = go.Figure(data=[surf], layout=go.Layout())
plot(fig, filename=f'terrain-{NUM_COLORS}colors.html', auto_open=False)
print("Success!")
print(f"File stored as 'terrain-{NUM_COLORS}colors.html'")
print()


# ---
print("Sorting colors for visual continuity... ", end='')
from colormath.color_diff import delta_e_cie2000
from colormath.color_objects import LabColor, sRGBColor
from colormath.color_conversions import convert_color
from pants import World, Solver
def rgb_distance(color1, color2):
    color1 = sRGBColor(*color1)
    color2 = sRGBColor(*color2)
    color1 = convert_color(color1, LabColor)
    color2 = convert_color(color2, LabColor)
    return float(delta_e_cie2000(color1, color2))
colors = [tuple(c) for c in colors]
solution = Solver().solve(World(colors, rgb_distance))
colors = np.array(solution.tour)
print("Success!")
print(f"Sorted colors array: {colors.shape[0]}x{colors.shape[1]}")
print()
show_colors(colors)


# ---
print(f"Creating visualisation of the {NUM_COLORS}-colors terrain... ", end='')
# Create a custom colormap
color_to_value = {tuple(color[:3]): i / (n_colors - 1) for i, color in enumerate(colors)}
my_cmap_ply = [(value, 'rgb({}, {}, {})'.format(*color)) for color, value in color_to_value.items()]
# Map pixels to values
fun_find_value = lambda x: color_to_value[tuple(x[:3])]
values = np.apply_along_axis(fun_find_value, 2, np.flipud(img))
# Display terrain
yy = np.linspace(0, 1, img.shape[0])
xx = np.linspace(0, 1, img.shape[1])
zz = np.zeros(img.shape[:2])
surf = go.Surface(
    x=xx, y=yy, z=zz,
    colorscale=my_cmap_ply,
    surfacecolor=values,
    showscale=False
)
fig = go.Figure(data=[surf], layout=go.Layout())
plot(fig, filename=f'terrain-{NUM_COLORS}colors-improved.html', auto_open=False)
print("Success!")
print(f"File stored as 'terrain-{NUM_COLORS}colors-improved.html'")
print()


# ---
# Load and display data
df = pd.read_csv('data/2842231742.csv')
cols = [col for col in df.columns if
        col.startswith('X_') or
        col.startswith('Y_') or
        col.startswith('Deaths_') or
        col.startswith('IsAlive_')
       ] + ['tick']
df = df[cols]
df.ffill(inplace=True)
print("Example data row:")
print(df.iloc[1000,:])
print()


# ---
# Infer players data from column names
players = set()
pattern = re.compile(r'[^_]+_([0-9])_([RD])_([a-z_]+)_([WL])')
for col in df.columns:
    match = re.match(pattern, col)
    if match:
        player_id, team, hero, outcome = match.groups()
        players.add((player_id, team, hero, outcome))
print("Players data:")
print(tabulate(players, headers=['id', 'team', 'hero', 'win/lose'], tablefmt="fancy_grid"))
print()


# ---
# Set styles
styles = {}
for player_id, team, hero, outcome in players:
    color = '#0088FF' if team == 'R' else '#FF530D'
    styles[hero] = {
        'mode': 'lines',
        'line': go.scatter3d.Line(color=color),
        'legendgroup': hero.replace('_', ' ').title(),
        'name': '{hero} ({team})'.format(hero=hero.replace('_', ' ').title(), team=team)
    }


# ---
# Generate movement traces
traces = []
col_suffix_pattern = '_{player_id}_{team}_{hero}_{outcome}'
for player_id, team, hero, outcome in players:
    col_suffix = col_suffix_pattern.format(player_id=player_id, team=team, hero=hero, outcome=outcome)
    for _, sub_df in df.groupby('Deaths' + col_suffix):
        sub_df = sub_df[sub_df['IsAlive' + col_suffix] == 1]
        xx = sub_df['X' + col_suffix].values
        yy = sub_df['Y' + col_suffix].values
        zz = sub_df['tick'].values
        style = styles[hero]
        trace = go.Scatter3d(
            x=xx, y=yy, z=zz,
            showlegend=False,
            **style
        )
        traces.append(trace)


# ---
# Generate death traces
for player_id, team, hero, outcome in players:
    col_suffix = col_suffix_pattern.format(player_id=player_id, team=team, hero=hero, outcome=outcome)

    spawn_locs, death_locs = [], [(np.nan, np.nan, np.nan)]
    for _, sub_df in df.groupby('Deaths' + col_suffix):
        sub_df = sub_df[sub_df['IsAlive' + col_suffix] == 1]
        xx = sub_df['X' + col_suffix].values
        yy = sub_df['Y' + col_suffix].values
        zz = sub_df['tick'].values
        # Save spawn and death location for this "life"
        spawn_locs.append((xx[0], yy[0], zz[0]))
        death_locs.append((xx[-1], yy[-1], zz[-1]))
    spawn_locs.append((np.nan, np.nan, np.nan))

    # Pairwise iterate death and spawn locations (misaligned on purpose with those NaNs)
    for death_loc, spawn_loc in zip(death_locs, spawn_locs):
        style = deepcopy(styles[hero])
        # noinspection PyTypeChecker
        style['line'] = go.scatter3d.Line(color=style['line']['color'], dash='dash')
        xx = [death_loc[0], spawn_loc[0]]
        yy = [death_loc[1], spawn_loc[1]]
        zz = [death_loc[2], spawn_loc[2]]
        trace = go.Scatter3d(
            x=xx, y=yy, z=zz,
            showlegend=False,
            **style
        )
        traces.append(trace)


# ---
# Setup legend
for legend_group, style in styles.items():
    trace = go.Scatter3d(
        x=[np.nan], y=[np.nan], z=[np.nan],
        **style
    )
    traces.append(trace)


# ---
print(f"Creating visualisation of the {NUM_COLORS}-colors terrain and hero paths... ", end='')
yy = np.linspace(-8000, +8000, img.shape[0])
xx = np.linspace(-8000, +8000, img.shape[1])
zz = np.full(img.shape[:2], -90)

surf = go.Surface(
    x=xx, y=yy, z=zz,
    colorscale=my_cmap_ply,
    surfacecolor=values,
    showscale=False
)

layout = go.Layout(
    margin=dict(l=0,r=0,b=0,t=0),
    scene=go.layout.Scene(
        xaxis=go.layout.scene.XAxis(title='', showticklabels=False),
        yaxis=go.layout.scene.YAxis(title='', showticklabels=False),
        zaxis=go.layout.scene.ZAxis(title='Time (s)'),
        aspectratio=dict(x=1, y=1, z=1.3),
        camera=go.layout.scene.Camera(
            projection=go.layout.scene.camera.Projection(
                type='orthographic'
            )
        )
    )
)
fig = go.Figure(data=[surf] + traces, layout=layout)
plot(fig, filename=f'terrain-{NUM_COLORS}colors-improved+paths-orthographic.html', auto_open=False)
print("Success!")
print(f"File stored as 'terrain-{NUM_COLORS}colors-improved+paths-orthographic.html'")
print()