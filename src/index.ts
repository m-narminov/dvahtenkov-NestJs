app.post(
  '/api/file',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const form = new formidable.IncomingForm()

      form.parse(req, (err, fields, files): void => {
        if (err) {
          console.error(err)
          res
            .status(500)
            .send(err)
            .end()
          return
        }

        let fileName = files.file.name
        const uploadFilePath = files.file.path
        const uploadFileName = files.file.name
        const base64FileName = Buffer.from(uploadFileName, 'utf-8').toString(
          'base64',
        )
        if (!fileName || fileName.trim() === '') {
          fileName = `${new Date()}`
        }
        const rawData = fs.readFileSync(uploadFilePath)
        fs.writeFile(`${filesPath}${base64FileName}`, rawData, err => {
          if (err) {
            res
              .status(500)
              .send('upload error')
              .end()
            return
          }

          res
            .status(200)
            .send(`File ${fileName} uploaded`)
            .end()
        })
      })
    } catch (e) {
      res
        .status(500)
        .send(e)
        .end()
    }
  },
)

app.get(
  '/api/file/:name',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      if (name.trim() === '') {
        res.status(404).end()
        return
      }
      const base64FileName = Buffer.from(name, 'utf-8').toString('base64')
      res.download(`${filesPath}${base64FileName}`, err => {
        if (err) {
          res
            .status(500)
            .send('Err while download file')
            .end()
          return
        }
      })
    } catch (e) {
      res.status(500)
    }
  },
)
