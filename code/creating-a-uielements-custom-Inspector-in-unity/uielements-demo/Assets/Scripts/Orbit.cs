using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Orbit : MonoBehaviour
{
    public Vector3 target;
    public float speed;

    void Update()
    {
        transform.RotateAround(target, Vector3.back, speed * Time.deltaTime);
    }
}
