using UnityEngine;

public enum Direction
{
    Left = -1,
    Centre = 0,
    Right = 1
}

public class ClingyUI : MonoBehaviour
{
    #region Inspector Properties

    [Tooltip("Which camera the UI should follow.")]
    [SerializeField] Camera followCamera;

    [Tooltip("The speed at which the UI should follow the camera.")]
    [SerializeField] float followSpeed = 1.5f;

    [Tooltip("How far to the left or right of centre the UI transform must be before it starts following the camera's gaze. Defines the 'dead zone' in which the UI does not move.")]
    [SerializeField] float thresholdAngle = 45.0f;

    #endregion

    #region Private Methods

    // Called every frame. Rotates the UI to always be in front of the camera.
    void Update()
    {
        // Throw out the Y axis to only consider a horizontal plane.
        Vector3 uiForwardXZ = new Vector3(transform.forward.x, 0.0f, transform.forward.z);
        Vector3 cameraForwardXZ = new Vector3(followCamera.transform.forward.x, 0.0f, followCamera.transform.forward.z);

        Debug.DrawRay(followCamera.transform.position, cameraForwardXZ * int.MaxValue, Color.blue);
        Debug.DrawRay(transform.position, uiForwardXZ * int.MaxValue, Color.red);

        // Calculate the angle between the UI and the camera.
        float angle = Vector3.Angle(uiForwardXZ, cameraForwardXZ);

        // If the UI is outside the threshold, smoothly move it back into the camera's periphery.
        if (Mathf.Abs(angle) > thresholdAngle)
        {
            // Determine whether the UI is to the left or right of the camera and calculate a vector pointing in that direction at thresholdAngle degrees.
            Direction direction = RelativeDirection(uiForwardXZ, cameraForwardXZ, Vector3.up);
            Vector3 threshold = Quaternion.AngleAxis(thresholdAngle * (int)direction, Vector3.up) * cameraForwardXZ;

            Debug.DrawRay(followCamera.transform.position, threshold * int.MaxValue, Color.green);

            // Calculate desired look rotation, negating pitch and roll axes.
            Quaternion desiredRotation = Quaternion.LookRotation(threshold, Vector3.up);
            desiredRotation = Quaternion.Euler(transform.rotation.x, desiredRotation.eulerAngles.y, transform.rotation.z);

            // Interpolate to the desired rotation.
            transform.rotation = Quaternion.Slerp(transform.rotation, desiredRotation, followSpeed * Time.deltaTime);
        }
    }

    // Returns the direction of targetDir in relation to forward.
    Direction RelativeDirection(Vector3 forward, Vector3 targetDir, Vector3 up)
    {
        Vector3 perp = Vector3.Cross(forward, targetDir);
        float dir = Vector3.Dot(perp, up);

        if(dir > 0.0f)
            return Direction.Left;
        else if(dir < 0.0f)
            return Direction.Right;
        else
            return Direction.Centre;
    }

    #endregion
}