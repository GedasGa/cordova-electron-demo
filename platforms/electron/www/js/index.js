/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        // Disabling form submissions if there are invalid fields
        this.disableFormSubmission();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        if (this.hasGetUserMedia()) {
            console.log('You are all set!');
            this.takePicture();
        } else {
            alert('getUserMedia() is not supported by your browser :/');
        }
    },

    disableFormSubmission: function() {
        window.addEventListener('load', function() {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    },

    hasGetUserMedia: function () {
        return !!(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia);
    },

    takePicture: function () {
        const captureVideoButton = document.querySelector('#open-camera');
        const screenshotButton = document.querySelector('#camera-capture');
        const img = document.querySelector('#profile-image');
        const video = document.querySelector('#video-container');

        const constraints = {
            video: {width: {exact: 200}, height: {exact: 150}}
        };

        const canvas = document.createElement('canvas');

        captureVideoButton.onclick = function() {
            navigator.mediaDevices.getUserMedia(constraints).
            then(handleSuccess).catch(handleError);
        };

        screenshotButton.onclick = function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            // Other browsers will fall back to image/png
            img.src = canvas.toDataURL('image/webp');
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                });
            }
        };

        function handleSuccess(stream) {
            screenshotButton.disabled = false;
            video.srcObject = stream;
        }

        function handleError(error) {
            console.error('Error: ', error);
        }
    }
};

app.initialize();