import fs from 'fs';
import gm from 'gm';
import path from 'path';

interface Options {
  type: 'jpg' | 'png';
  size: number;
  density: number;
  quality: number;
  outputdir: string;
  outputname: string;
}

const defaultOptions: Partial<Options> = {
  type: 'jpg',
  size: 1024,
  density: 600,
  quality: 100,
};

class PdvConverter {
  private options: Options;
  constructor(options: Options) {
    this.options = {
      type: options.type ?? defaultOptions.type,
      size: options.size ?? defaultOptions.size,
      density: options.density ?? defaultOptions.density,
      quality: options.quality ?? defaultOptions.quality,
      outputdir: options.outputdir,
      outputname: options.outputname,
    };
  }

  public async convertPdfToImage(input: string | Buffer) {
    if (typeof input === 'string') {
      this.checkValidInput(input);
    }

    const outputDir = this.createOutputDir();
    const outputFile = `${outputDir}${this.options.outputname}.${this.options.type}`;
    await this.convert(input, outputFile);
  }

  private convert = async (input: string | Buffer, output: string) => {
    let gmInstance: gm.State;
    if (typeof input === 'string') {
      const inputStream = fs.createReadStream(input);
      if (!inputStream.path) {
        throw new Error('Input file does not exist');
      }
      const filepath = inputStream.path as string;
      gmInstance = gm(inputStream, filepath);
    } else {
      gmInstance = gm(input);
    }

    return new Promise<void>((res, rej) => {
      gmInstance
        .density(this.options.density, this.options.density)
        .resize(this.options.size)
        .quality(this.options.quality)
        .write(output, function (e) {
          if (e) {
            rej(e);
            return;
          }
          if (!(fs.statSync(output)['size'] / 1000)) {
            rej(new Error('Output file is empty'));
            return;
          }

          res();
        });
    });
  };

  private checkValidInput(input: string) {
    if (path.extname(path.basename(input)) != '.pdf') {
      throw new Error('Input file is not a PDF');
    }
    if (!this.fileExists(input)) {
      throw new Error('Input file does not exist');
    }
  }

  private createOutputDir() {
    const outputDir = this.options.outputdir + path.sep;

    if (!this.dirExists(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    return outputDir;
  }

  private dirExists = (dir: string) => {
    try {
      return fs.statSync(dir).isDirectory();
    } catch (err) {
      return false;
    }
  };

  private fileExists = (file: string) => {
    try {
      return fs.statSync(file).isFile();
    } catch (err) {
      return false;
    }
  };
}

const convertToPdf = async (input: string | Buffer, options: Options) => {
  const converter = new PdvConverter(options);
  await converter.convertPdfToImage(input);
};

export default convertToPdf;
