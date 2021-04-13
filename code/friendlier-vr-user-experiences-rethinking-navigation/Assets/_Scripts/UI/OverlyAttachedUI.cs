using UnityEngine;
using System.Collections;

public class OverlyAttachedUI : MonoBehaviour {

    [Tooltip("Which camera the UI should follow.")]
    [SerializeField]
    Camera followCamera;

    [Tooltip("The speed at which the UI should follow the camera.")]
    [SerializeField]
    float followSpeed = 1.5f;

	// Update is called once per frame
	void Update ()
    {
        transform.rotation = Quaternion.Slerp(transform.rotation, followCamera.transform.rotation, followSpeed * Time.deltaTime);
    }
}
