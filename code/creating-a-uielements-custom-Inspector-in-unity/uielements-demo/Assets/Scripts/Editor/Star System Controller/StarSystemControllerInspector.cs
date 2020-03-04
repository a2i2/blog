using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using UnityEditor.UIElements;
using UnityEditor.SceneManagement;

[CustomEditor(typeof(StarSystemController))]
public class StarSystemControllerInspector : Editor
{
    private VisualElement rootElement;
    private StarSystemController controller;

    public void OnEnable()
    {
        controller = (StarSystemController)target;
        rootElement = new VisualElement();

        IMGUIContainer defaultInspector = new IMGUIContainer(() => DrawDefaultInspector());
        rootElement.Add(defaultInspector);

        #region Setup UXML and USS

        VisualTreeAsset visualTree = AssetDatabase.LoadAssetAtPath<VisualTreeAsset>("Assets/Scripts/Editor/Star System Controller/StarSystemControllerInspector.uxml");
        visualTree.CloneTree(rootElement);

        StyleSheet stylesheet = AssetDatabase.LoadAssetAtPath<StyleSheet>("Assets/Scripts/Editor/Star System Controller/StarSystemControllerInspector.uss");
        rootElement.styleSheets.Add(stylesheet);

        #endregion
    }

    public override VisualElement CreateInspectorGUI()
    {
        Button btnUpdateSystem = rootElement.Query<Button>("btnUpdateSystem").First();
        btnUpdateSystem.clickable.clicked += UpdateStarSystem;
        return rootElement;
    }

    private void UpdateStarSystem()
    {
        EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
        controller.UpdateSystem();
    }

}
