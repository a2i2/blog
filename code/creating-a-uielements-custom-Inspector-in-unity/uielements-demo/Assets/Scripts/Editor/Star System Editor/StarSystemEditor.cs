using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using UnityEditor.UIElements;

//[CustomEditor(typeof(StarSystem))]
public class StarSystemEditor : Editor
{
    private VisualElement rootElement;
    private VisualElement planetList;
    private StarSystem starSystem;

    public void OnEnable()
    {
        starSystem = (StarSystem)target;
        rootElement = new VisualElement();

        // Load in UXML template and USS styles, then apply them to the root element.
        VisualTreeAsset visualTree = AssetDatabase.LoadAssetAtPath<VisualTreeAsset>("Assets/Scripts/Editor/Star System Editor/StarSystemEditor.uxml");
        visualTree.CloneTree(rootElement);

        StyleSheet stylesheet = AssetDatabase.LoadAssetAtPath<StyleSheet>("Assets/Scripts/Editor/Star System Editor/StarSystemEditor.uss");
        rootElement.styleSheets.Add(stylesheet);
    }

    public override VisualElement CreateInspectorGUI()
    {
        #region Fields
        // Find the visual element with the name "systemSprite" and make it display the star system sprite if it has one.
        VisualElement systemSprite = rootElement.Query<VisualElement>("systemSprite").First();
        systemSprite.style.backgroundImage = starSystem.sprite ? starSystem.sprite.texture : null;

        // Find an object field with the name "systemSpriteField", set that it only accepts objects of type Sprite,
        // set its initial value and register a callback that will occur if the value of the filed changes.
        ObjectField spriteField = rootElement.Query<ObjectField>("systemSpriteField").First();
        spriteField.objectType = typeof(Sprite);
        spriteField.value = starSystem.sprite;
        spriteField.RegisterCallback<ChangeEvent<Object>>(
            e =>
            {
                starSystem.sprite = (Sprite)e.newValue;
                systemSprite.style.backgroundImage = starSystem.sprite.texture;
                // Set StarSystem as being dirty. This tells the editor that there have been changes made to the asset and that it requires a save. 
                EditorUtility.SetDirty(starSystem);
            }
        );

        FloatField scaleField = rootElement.Query<FloatField>("starScale").First();
        scaleField.value = starSystem.scale;
        scaleField.RegisterCallback<ChangeEvent<float>>(
            e => {
                starSystem.scale = e.newValue;
                EditorUtility.SetDirty(starSystem);
            }
        );
        #endregion

        #region Display Planet Data 
        // Store visual element that will contain the planet sub-inspectors. 
        planetList = rootElement.Query<VisualElement>("planetList").First();
        UpdatePlanets();
        #endregion

        #region Buttons
        // Assign methods to the click events of the two buttons.
        Button btnAddPlanet = rootElement.Query<Button>("btnAddNew").First();
        btnAddPlanet.clickable.clicked += AddPlanet;

        Button btnRemoveAllPlanets = rootElement.Query<Button>("btnRemoveAll").First();
        btnRemoveAllPlanets.clickable.clicked += RemoveAll;
        #endregion

        return rootElement;
    }

    #region Display Planet Data Functions
    public void UpdatePlanets()
    {
        planetList.Clear();
        // Create and add a PlanetSubEditor to our planetList container for each planet.
        foreach (Planet planet in starSystem.planets)
        {
            PlanetSubEditor planetSubEditor = new PlanetSubEditor(this, planet);
            planetList.Add(planetSubEditor);
        }
    }
    #endregion

    #region Button Functions
    // Create a new Planet that is a child to the StarSystem asset. Save the assets to disk and update the Planet sub-inspectors.
    private void AddPlanet()
    {
        Planet planet = ScriptableObject.CreateInstance<Planet>();
        planet.name = "New Planet";
        starSystem.planets.Add(planet);
        AssetDatabase.AddObjectToAsset(planet, starSystem);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        UpdatePlanets();
    }
    // Remove all the planets from the StarSystem asset, save the changes and then remove all the Planet sub-inspectors.
    private void RemoveAll()
    {
        if (EditorUtility.DisplayDialog("Delete All Planets", "Are you sure you want to delete all of the planets this star system has?", "Delete All", "Cancel"))
        {
            for (int i = starSystem.planets.Count - 1; i >= 0; i--)
            {
                AssetDatabase.RemoveObjectFromAsset(starSystem.planets[i]);
                starSystem.planets.RemoveAt(i);
            }
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            UpdatePlanets();
        }
    }
    // Remove a specified Planet from the StarSystem asset, save the changes and update the Planet sub-inspectors.
    public void RemovePlanet(Planet planet)
    {
        starSystem.planets.Remove(planet);
        AssetDatabase.RemoveObjectFromAsset(planet);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        UpdatePlanets();
    }
    #endregion
}