using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using UnityEditor.UIElements;

public class PlanetSubEditor : VisualElement
{
    Planet planet;
    StarSystemEditor starSystemEditor;

    public PlanetSubEditor(StarSystemEditor starSystemEditor, Planet planet)
    {
        this.starSystemEditor = starSystemEditor;
        this.planet = planet;

        #region Setup UXML and USS
        VisualTreeAsset visualTree = AssetDatabase.LoadAssetAtPath<VisualTreeAsset>("Assets/Scripts/Editor/Star System Editor/PlanetSubEditor.uxml");
        visualTree.CloneTree(this);

        StyleSheet stylesheet = AssetDatabase.LoadAssetAtPath<StyleSheet>("Assets/Scripts/Editor/Star System Editor/PlanetSubEditor.uss");
        this.styleSheets.Add(stylesheet);

        this.AddToClassList("planetSubeditor");
        #endregion

        #region Fields
        TextField nameField = this.Query<TextField>("planetName").First();
        nameField.value = planet.name;
        nameField.RegisterCallback<ChangeEvent<string>>(
            e =>
            {
                planet.name = (string)e.newValue;
                EditorUtility.SetDirty(planet);
            }
        );

        // Sprite is displayed the same way as in the Star System Inspector
        VisualElement planetSpriteDisplay = this.Query<VisualElement>("planetSpriteDisplay").First();
        planetSpriteDisplay.style.backgroundImage = planet.sprite ? planet.sprite.texture : null;

        ObjectField spriteField = this.Query<ObjectField>("planetSprite").First();
        spriteField.objectType = typeof(Sprite);
        spriteField.value = planet.sprite;
        spriteField.RegisterCallback<ChangeEvent<Object>>(
            e =>
            {
                planet.sprite = (Sprite)e.newValue;
                planetSpriteDisplay.style.backgroundImage = planet.sprite.texture;
                EditorUtility.SetDirty(planet);
            }
        );

        FloatField scaleField = this.Query<FloatField>("planetScale").First();
        scaleField.value = planet.scale;
        scaleField.RegisterCallback<ChangeEvent<float>>(
            e =>
            {
                planet.scale = e.newValue;
                EditorUtility.SetDirty(planet);
            }
        );

        FloatField distanceField = this.Query<FloatField>("planetDistance").First();
        distanceField.value = planet.distance;
        distanceField.RegisterCallback<ChangeEvent<float>>(
            e =>
            {
                planet.distance = e.newValue;
                EditorUtility.SetDirty(planet);
            }
        );


        FloatField speedField = this.Query<FloatField>("planetSpeed").First();
        speedField.value = planet.speed;
        speedField.RegisterCallback<ChangeEvent<float>>(
            e =>
            {
                planet.speed = e.newValue;
                EditorUtility.SetDirty(planet);
            }
        );

        #endregion

        #region Buttons

        Button btnAddPlanet = this.Query<Button>("btnRemove").First();
        btnAddPlanet.clickable.clicked += RemovePlanet;

        #endregion
    }

    #region Button Functions

    private void RemovePlanet()
    {
        if (EditorUtility.DisplayDialog("Delete Planet", "Are you sure you want to delete this planet?", "Delete", "Cancel"))
            starSystemEditor.RemovePlanet(planet);
    }

    #endregion
}
