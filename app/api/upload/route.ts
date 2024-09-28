// import { NextResponse } from 'next/server'
// import { customAlphabet } from 'nanoid'

// export const runtime = 'edge'

// const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 7) // 7-character random string

// export async function POST(req: Request) {
//   const blob = await req.blob()
//   const contentType = req.headers.get('content-type') || 'application/octet-stream'
//   const filename = `${nanoid()}.${contentType.split('/')[1]}`
//   const backendUrl = 'http://localhost:8000/upload'

//   try {
//     const response = await fetch(backendUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': contentType,
//         'X-Filename': filename,
//         // Add any other headers your backend might need
//       },
//       body: blob,
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const result = await response.json()
//     return NextResponse.json(result)
//   } catch (error) {
//     console.error('Error uploading file:', error)
//     return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
//   }
// }