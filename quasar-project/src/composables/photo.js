import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'

const takePicture = async (camSource = true) => {
  const image = await Camera.getPhoto({
    quality: 90,
    saveToGallery: true,
    source: camSource ? CameraSource.Camera : CameraSource.Photos,
    resultType: CameraResultType.Uri,
  })

  return await readAsBase64(image)
}

const savePicture = async (photo) => {
  // Convert photo to base64 format, required by Filesystem API to save
  const base64Data = await readAsBase64(photo)

  // Write the file to the data directory
  const fileName = Date.now() + '.jpeg'
  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  })

  // Use webPath to display the new image instead of base64 since it's
  // already loaded into memory
  return {
    filepath: fileName,
    webviewPath: photo.webPath,
  }
}

const readAsBase64 = async (photo) => {
  // Fetch the photo, read as a blob, then convert to base64 format
  const response = await fetch(photo.webPath)
  const blob = await response.blob()

  return (await convertBlobToBase64(blob))
}

const convertBlobToBase64 = async (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })

export { takePicture, savePicture, readAsBase64 }
