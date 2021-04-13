using UnityEngine;
using System.Collections;
using VRStandardAssets.Utils;

public class GlowMaterial : MonoBehaviour
{
    VRInteractiveItem vrInteractiveItem;

    Color normalColor = new Color32(34, 44, 55, 255);
    Color glowColor = new Color32(255, 128, 0, 255);

    float glowRate = 5.0f;
    float glowAmount = 0.0f;
    float targetGlowAmount = 0.0f;

    Material material;
    string colorPropertyName = "_Tint";

    void Awake()
    {
        material = GetComponent<Renderer>().material;
        vrInteractiveItem = GetComponentInChildren<VRInteractiveItem>();
        if(vrInteractiveItem)
        {
            vrInteractiveItem.OnOver += Glow;
            vrInteractiveItem.OnOut += UnGlow;
        }
    }

    void Update()
    {
        if (glowAmount != targetGlowAmount)
        {
            if (glowAmount <= targetGlowAmount)
                glowAmount = Mathf.Clamp(glowAmount + Time.deltaTime * glowRate, 0.0f, 1.0f);
            else if (glowAmount >= targetGlowAmount)
                glowAmount = Mathf.Clamp(glowAmount - Time.deltaTime * glowRate, 0.0f, 1.0f);

            material.SetColor(colorPropertyName, Color.Lerp(normalColor, glowColor, glowAmount));
        }
    }

    public void Glow()
    {
        targetGlowAmount = 1.0f;
    }

    public void UnGlow()
    {
        targetGlowAmount = 0.0f;
    }
}
