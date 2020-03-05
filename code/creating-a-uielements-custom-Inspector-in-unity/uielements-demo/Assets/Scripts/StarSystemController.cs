using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[ExecuteInEditMode]
public class StarSystemController : MonoBehaviour
{
    public StarSystem starSystem;
    public GameObject starPrefab;
    public GameObject planetPrefab;


    [HideInInspector][SerializeField] private GameObject starObject;
    [HideInInspector][SerializeField] private List<GameObject> planetObjects = new List<GameObject>();


    public void UpdateSystem()
    {
        ClearSystem();

        //Create Star GameObject
        starObject = Instantiate(starPrefab, transform.position, Quaternion.identity);
        starObject.transform.parent = gameObject.transform;
        SpriteRenderer starSpriteRenderer = starObject.GetComponent<SpriteRenderer>();
        starSpriteRenderer.sprite = starSystem.sprite;
        starObject.transform.localScale = Vector3.one * starSystem.scale;

        //Create Planet GameObjects
        foreach (Planet planet in starSystem.planets)
        {
            GameObject newPlanetObject = Instantiate(planetPrefab, transform.position, Quaternion.identity);
            newPlanetObject.transform.parent = gameObject.transform;
            SpriteRenderer planetSpriteRenderer = newPlanetObject.GetComponent<SpriteRenderer>();
            planetSpriteRenderer.sprite = planet.sprite;

            newPlanetObject.name = planet.name;
            newPlanetObject.transform.localScale = Vector3.one * planet.scale;
            newPlanetObject.transform.position += new Vector3(1, 0, 0) * 0.01f * planet.distance;

            Orbit orbit = newPlanetObject.GetComponent<Orbit>();
            orbit.speed = planet.speed;

            planetObjects.Add(newPlanetObject);
        }

    }

    private void ClearSystem()
    {
        if (starObject != null)
        {
            DestroyImmediate(starObject);
            starObject = null;
        }

        if(planetObjects.Count > 0)
        {
            foreach(GameObject planet in planetObjects)
            {
                DestroyImmediate(planet);
            }
        }
        planetObjects.Clear();
    }
}
