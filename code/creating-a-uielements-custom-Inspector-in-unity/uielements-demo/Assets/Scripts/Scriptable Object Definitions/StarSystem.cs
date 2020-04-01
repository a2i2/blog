using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "New Star System", menuName = "Star System")]
public class StarSystem : ScriptableObject
{
    public Sprite sprite;
    public List<Planet> planets;
    public float scale;

    private void OnEnable()
    {
        if (planets == null)
            planets = new List<Planet>();
    }
}
