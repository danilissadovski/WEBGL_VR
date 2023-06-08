let sensor = {
  x: 0,
  y: 0,
  z: 0
}
let permission = false;
function requestDeviceOrientation() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        console.log(response);
        // let p = document.getElementById("p")
        // p.innerHTML = response
        if (response === 'granted') {
          console.log('Permission granted');
          permission = true
          window.addEventListener('deviceorientation', e => {

            // let p = document.getElementById("p")
            // p.innerHTML = e.alpha
            sensor.x = e.alpha
            sensor.y = e.beta
            sensor.z = e.gamma
          }, true);
        }
      }).catch((err => {
        console.log('Err', err);
      }));
  } else
    console.log('not iOS');
}

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

function getRotationMatrix(alpha, beta, gamma) {

  var _x = beta ? beta * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos(_x);
  var cY = Math.cos(_y);
  var cZ = Math.cos(_z);
  var sX = Math.sin(_x);
  var sY = Math.sin(_y);
  var sZ = Math.sin(_z);

  //
  // ZXY rotation matrix construction.
  //

  var m11 = cZ * cY - sZ * sX * sY;
  var m12 = - cX * sZ;
  var m13 = cY * sZ * sX + cZ * sY;

  var m21 = cY * sZ + cZ * sX * sY;
  var m22 = cZ * cX;
  var m23 = sZ * sY - cZ * cY * sX;

  var m31 = - cX * sY;
  var m32 = sX;
  var m33 = cX * cY;

  return [
    m11, m12, m13, 0,
    m21, m22, m23, 0,
    m31, m32, m33, 0,
    0, 0, 0, 1
  ];

};

function orientVector(alpha, beta, gamma) {
  // Convert angles to radians
  const a = (alpha * Math.PI) / 180;
  const b = (beta * Math.PI) / 180;
  const g = (gamma * Math.PI) / 180;

  // Define the initial vector along the x-axis
  let vector = [0, 1, 0];

  // Rotation around the z-axis (gamma)
  const rotZ = [
    [Math.cos(g), -Math.sin(g), 0],
    [Math.sin(g), Math.cos(g), 0],
    [0, 0, 1]
  ];
  vector = multiplyMatrixVector(rotZ, vector);

  // Rotation around the y-axis (beta)
  const rotY = [
    [Math.cos(b), 0, Math.sin(b)],
    [0, 1, 0],
    [-Math.sin(b), 0, Math.cos(b)]
  ];
  vector = multiplyMatrixVector(rotY, vector);

  // Rotation around the x-axis (alpha)
  const rotX = [
    [1, 0, 0],
    [0, Math.cos(a), -Math.sin(a)],
    [0, Math.sin(a), Math.cos(a)]
  ];
  vector = multiplyMatrixVector(rotX, vector);

  return vector;
}

function multiplyMatrixVector(matrix, vector) {
  const result = [];
  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result.push(sum);
  }
  return result;
}