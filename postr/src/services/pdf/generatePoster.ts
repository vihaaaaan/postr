import { PDFDocument, rgb} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { getMovieData } from '../tmdb/movieData'
import { getImages } from '../tmdb/movieImages'

const POSTER_SIZES: Record<string, [number, number]> = {
  A4: [595, 842],
  POSTER_18x24: [1296, 1728],
  POSTER_24x36: [1728, 2592],
  SQUARE: [1080, 1080],
}

export async function generatePoster(movie_id: number) {
  // Fetch movie data and images in parallel
  const [movie_data, movie_images] = await Promise.all([
    getMovieData(movie_id),
    getImages(movie_id)
  ]);

  // Use the first backdrop image
  const backdrop_image = movie_images[0];
  if (!backdrop_image) {
    throw new Error('No images available for this movie');
  }

  const pdfDoc = await PDFDocument.create()
  
  // Register fontkit to enable custom fonts
  pdfDoc.registerFontkit(fontkit)
  
  // Load fonts
  const font_bold_url = '/fonts/Inter-Bold.ttf'
  const font_regular_url = '/fonts/Inter-Regular.ttf'
  const font_medium_url = '/fonts/Inter-Medium.ttf'
  
  const [font_bold_bytes, font_regular_bytes, font_medium_bytes] = await Promise.all([
    fetch(font_bold_url).then(res => res.arrayBuffer()),
    fetch(font_regular_url).then(res => res.arrayBuffer()),
    fetch(font_medium_url).then(res => res.arrayBuffer())
  ]);

  const font_bold = await pdfDoc.embedFont(font_bold_bytes)
  const font_regular = await pdfDoc.embedFont(font_regular_bytes)
  const font_medium = await pdfDoc.embedFont(font_medium_bytes)

  // Create page
  const page = pdfDoc.addPage(POSTER_SIZES.POSTER_18x24)
  const { width, height } = page.getSize()
  
  // Colors
  const bg_color = rgb(0.95, 0.94, 0.92) // Beige background
  const text_color = rgb(0.1, 0.1, 0.1) // Dark text
  const accent_line_color = rgb(0, 0, 0) // Black accent line
  
  // Draw background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: bg_color,
  })
  
  const margin = 60
  const content_width = width - (margin * 2)
  
  // Download and embed the backdrop image
  const image_response = await fetch(backdrop_image.url)
  const image_bytes = await image_response.arrayBuffer()
  const image = await pdfDoc.embedJpg(image_bytes)
  
  // Calculate image dimensions (maintain aspect ratio)
  const image_width = content_width
  const image_height = image_width / backdrop_image.aspect_ratio
  const image_y = height - margin - image_height - 200 // Leave space for title
  
  // Draw the movie image
  page.drawImage(image, {
    x: margin,
    y: image_y,
    width: image_width,
    height: image_height,
  })
  
  // Draw title at top
  const title_size = 60
  const title_y = height - margin - 100
  page.drawText(movie_data.title, {
    x: margin,
    y: title_y,
    size: title_size,
    font: font_bold,
    color: text_color,
    maxWidth: content_width,
  })
  
  // Draw year in top right
  if (movie_data.release_date) {
    const year = movie_data.release_date.getFullYear().toString()
    const year_size = 24
    const year_width = font_medium.widthOfTextAtSize(year, year_size)
    page.drawText(year, {
      x: width - margin - year_width,
      y: height - margin - 30,
      size: year_size,
      font: font_medium,
      color: text_color,
    })
  }
  
  // Draw thin line separator above bottom text
  const line_y = image_y - 40
  page.drawLine({
    start: { x: margin, y: line_y },
    end: { x: width - margin, y: line_y },
    thickness: 1,
    color: accent_line_color,
  })
  
  // Draw director info
  let current_y = line_y - 30
  if (movie_data.director) {
    page.drawText(`Directed by ${movie_data.director}`, {
      x: margin,
      y: current_y,
      size: 14,
      font: font_medium,
      color: text_color,
    })
    current_y -= 25
  }
  
  // Draw writers
  if (movie_data.writers.length > 0) {
    const writers_text = movie_data.writers.length === 1 
      ? `Written by ${movie_data.writers[0]}`
      : `Written by ${movie_data.writers.join(', ')}`
    
    page.drawText(writers_text, {
      x: margin,
      y: current_y,
      size: 12,
      font: font_regular,
      color: text_color,
      maxWidth: content_width,
    })
    current_y -= 40
  }
  
  // Draw cast (top 5 actors)
  if (movie_data.actors.length > 0) {
    const top_actors = movie_data.actors.slice(0, 5)
    const cast_text = top_actors.join(', ')
    
    // Word wrap for cast
    const lines = wrapText(cast_text, content_width, font_regular, 11)
    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y: current_y,
        size: 11,
        font: font_regular,
        color: text_color,
      })
      current_y -= 18
    }
  }
  
  // Draw release date at bottom
  if (movie_data.release_date) {
    const date_text = movie_data.release_date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    page.drawText(date_text, {
      x: margin,
      y: margin,
      size: 10,
      font: font_regular,
      color: text_color,
    })
  }

  console.log("Downloading poster PDF...")

  const pdfBytes = await pdfDoc.save()

  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${movie_data.title.replace(/[^a-z0-9]/gi, '_')}_poster.pdf`
  a.click()

  URL.revokeObjectURL(url)
}

// Helper function to wrap text
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current_line = ''
  
  for (const word of words) {
    const test_line = current_line ? `${current_line} ${word}` : word
    const width = font.widthOfTextAtSize(test_line, fontSize)
    
    if (width > maxWidth && current_line) {
      lines.push(current_line)
      current_line = word
    } else {
      current_line = test_line
    }
  }
  
  if (current_line) {
    lines.push(current_line)
  }
  
  return lines
}