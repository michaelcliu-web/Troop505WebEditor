import ButtonBlock from './ButtonBlock'
import CalendarBlock from './CalendarBlock'
import GalleryBlock from './GalleryBlock'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import VideoBlock from './VideoBlock'

/*
  The block registry: maps a block's `type` string to the component that draws it.

  Adding a new kind of block is exactly two steps — describe its defaults in schema.js,
  then add it here. Nothing else in the app needs to change, including the editor.
*/
export const BLOCK_COMPONENTS = {
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  gallery: GalleryBlock,
  video: VideoBlock,
  calendar: CalendarBlock,
}
