const { uuid } = require('uuidv4');
const sharp = require('sharp');
const path = require('path');

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(150, 150, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath)
      .then(result => console.log(result))
      .catch(result => console.log(result));

    return filename;
  }

  static filename() {
    return `${uuid()}.png`;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}

module.exports = Resize;