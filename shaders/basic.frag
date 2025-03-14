#version 410 core

in vec3 fPosition;
in vec3 fNormal;
in vec2 fTexCoords;

in vec4 fPosLight;
uniform sampler2D shadowMap;

out vec4 fColor;

//matrices
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;

//lighting
uniform vec3 lightDir;
uniform vec3 lightColor;
uniform vec3 punctLight;
uniform vec3 punctLightColor;

// textures
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
uniform int fog;
uniform int secondLight;

//components
vec3 ambient;
float ambientStrength = 0.2f;
vec3 diffuse;
vec3 specular;
float specularStrength = 0.5f;

vec4 fPosEye;
float constant = 1.0f;
float linear = 0.045f;
float quadratic = 0.0075f;


float shadow()
{
    vec3 normalizedCoords = fPosLight.xyz / fPosLight.w;

    normalizedCoords = normalizedCoords * 0.5 + 0.5;
	
	if (normalizedCoords.z > 1.0f) return 0.0f;

	float closestDepth = texture(shadowMap, normalizedCoords.xy).r;

	float currentDepth = normalizedCoords.z;

	float bias = max(0.05f * (1.0f - dot(fNormal,lightDir)), 0.05f);
	float shadow = currentDepth - bias > closestDepth ? 1.0 : 0.0;	

	return shadow;

}

float computeFog()
{
     fPosEye = view * model * vec4(fPosition, 1.0f);
     float fogDensity = 0.007f;
     float fragmentDistance = length(fPosEye);
     float fogFactor = exp(-pow(fragmentDistance * fogDensity, 2));

     return clamp(fogFactor, 0.0f, 1.0f);
}

void computeDirLight()
{
    //compute eye space coordinates
    fPosEye = view * model * vec4(fPosition, 1.0f);
    vec3 normalEye = normalize(normalMatrix * fNormal);

    //normalize light direction
    vec3 lightDirN = vec3(normalize(view * vec4(lightDir, 0.0f)));

    //compute view direction (in eye coordinates, the viewer is situated at the origin
    vec3 viewDir = normalize(- fPosEye.xyz);

    //compute ambient light
    ambient = ambientStrength * lightColor;

    //compute diffuse light
    diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor;

    //compute specular light
    vec3 reflectDir = reflect(-lightDirN, normalEye);
    float specCoeff = pow(max(dot(viewDir, reflectDir), 0.0f), 32);
    specular = specularStrength * specCoeff * lightColor;
}

vec3 computePunctiformLight(vec3 diffTex, vec3 specTex) 
{
    fPosEye = vec4(fPosition, 1.0f);

    float dist = length(punctLight - fPosEye.xyz);

    float att = 1.0f / (constant + linear * dist + quadratic * (dist * dist));

    vec3 normalEye = normalize(fNormal);
    vec3 lightDirN = normalize(punctLight - fPosEye.xyz);
    vec3 viewDirN = normalize(punctLight - fPosEye.xyz);

    vec3 ambient1 = att * ambientStrength * punctLightColor;
    vec3 diffuse1 = att * max(dot(normalEye, lightDirN), 0.0f) * punctLightColor;

    vec3 halfVector = normalize(lightDirN + viewDirN);
    float specCoeff = pow(max(dot(viewDirN, halfVector), 0.3f), 32.0f);
    vec3 specular1 = att * specularStrength * specCoeff * punctLightColor;

    return min(((ambient1 + diffuse1) * diffTex + specular1 * specTex) * att * 2, 1.0f);
}


void main() 
{
    vec4 texColorDiffuse = texture(diffuseTexture, fTexCoords);
    if(texColorDiffuse.a < 0.005 ){
       discard;
    }
    vec4 texColorSpecular = texture(specularTexture, fTexCoords);
    if(texColorSpecular.a < 0.005 ){
        discard;
    }    
    computeDirLight();
    vec3 punctiformLight = computePunctiformLight(texColorDiffuse.rgb,texColorSpecular.rgb);

    ambient *= texColorDiffuse.rgb;
	diffuse *= texColorDiffuse.rgb;
	specular *= texColorSpecular.rgb;
    
    float shadow = shadow();
    vec3 color = min((ambient + (1.0f - shadow)*diffuse) + (1.0f - shadow)*specular, 1.0f);

    if(secondLight == 1)
    {   color = color + punctiformLight;
    }
    
    vec4 colorF = vec4(color, 1.0f);

    if(fog == 1)
    {        
        float fogFactor = computeFog();
        vec4 fogColor = vec4(0.5f, 0.5f, 0.5f, 1.0f);
        fColor = fogColor * (1 - fogFactor) + colorF * fogFactor;
    }else
    {
        fColor = colorF;
    }
}
