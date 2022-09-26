*This package is mainly inspired by pdf2img, and resolves concurrent pdf conversion problems, and allows more options for one page pdfs.*

# Prerequisite
This package needs **ghostscript** and **graphicsmagick**

# Installation
```
    npm install @weepulse/pdf-image
```

# Usage
 ```javascript
    // Pdf can either be a file path, or a Buffer
    
    await convertToPdf(pdf, {
	  type:  'png',
      size:  1024,
      density:  150,
      quality:  100,
      outputdir:  tempFolder,
      outputname:  fileName,
    });
    
    return  `${tempFolder}/${fileName}.png`;
 ```
# Configuration reference
```typescript
    interface  Options {
      type:  'jpg'  |  'png';
      size:  number;
      density:  number;
      quality:  number;
      outputdir:  string;
      outputname:  string;
    }
```