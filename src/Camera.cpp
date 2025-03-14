#include "Camera.hpp"

namespace gps {

    //Camera constructor
    Camera::Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp) {
        this->cameraPosition = cameraPosition;
        this->cameraTarget = cameraTarget;
        this->cameraFrontDirection = glm::normalize(cameraTarget - cameraPosition);
        this->cameraRightDirection = glm::normalize(glm::cross(this->cameraFrontDirection, glm::vec3(0.0f, 1.0f, 0.0f)));
        this->cameraUpDirection = cameraUp;
        
    }

    //return the view matrix, using the glm::lookAt() function
    glm::mat4 Camera::getViewMatrix() {
        return glm::lookAt(cameraPosition, cameraTarget, this->cameraUpDirection);
    }

    //update the camera internal parameters following a camera move event
    void Camera::move(MOVE_DIRECTION direction, float speed) 
    {
        switch (direction) {
        case MOVE_FORWARD:
            cameraPosition += cameraFrontDirection * speed;
            break;

        case MOVE_BACKWARD:
            cameraPosition -= cameraFrontDirection * speed;
            break;

        case MOVE_RIGHT:
            cameraPosition += cameraRightDirection * speed;
            break;

        case MOVE_LEFT:
            cameraPosition -= cameraRightDirection * speed;
            break;

        case MOVE_UP: 
            cameraPosition += cameraUpDirection * speed;
            break;

        case MOVE_DOWN: 
            cameraPosition -= cameraUpDirection * speed;
            break;
        }
        cameraTarget = cameraPosition + cameraFrontDirection;
    }

    //update the camera internal parameters following a camera rotate event
    //yaw - camera rotation around the y axis
    //pitch - camera rotation around the x axis
    void Camera::rotate(float pitchDelta, float yawDelta, float rollDelta) {
        yaw += yawDelta;
        pitch += pitchDelta;

        if (pitch > 89.0f) pitch = 89.0f;
        if (pitch < -89.0f) pitch = -89.0f;

        glm::vec3 direction;
        direction.x = cos(glm::radians(yaw)) * cos(glm::radians(pitch));
        direction.y = sin(glm::radians(pitch));
        direction.z = sin(glm::radians(yaw)) * cos(glm::radians(pitch));
        cameraFrontDirection = glm::normalize(direction);

        if (rollDelta != 0.0f) {
            glm::mat4 rotationMatrix = glm::rotate(glm::mat4(1.0f), glm::radians(rollDelta), cameraFrontDirection);
            cameraUpDirection = glm::normalize(glm::vec3(rotationMatrix * glm::vec4(cameraUpDirection, 0.0f)));
            cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, cameraUpDirection));
        }
        else {
            cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, glm::vec3(0.0f, 1.0f, 0.0f))); 
            cameraUpDirection = glm::normalize(glm::cross(cameraRightDirection, cameraFrontDirection));
        }

        // Update the target position
        cameraTarget = cameraPosition + cameraFrontDirection;
    }


}
