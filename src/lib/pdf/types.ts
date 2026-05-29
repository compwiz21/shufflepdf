export type PageId = string;
export type AnnotationId = string;
export type DocId = string;
export type PageRotation = 0 | 90 | 180 | 270;

export interface SourceDoc {
  id: DocId;
  bytes: Uint8Array;
  filename: string;
}

export interface PageState {
  id: PageId;
  sourceDocId: DocId;
  sourceIndex: number;
  rotation: PageRotation;
  annotations: Annotation[];
}

export type Annotation =
  | TextAnnotation
  | HighlightAnnotation
  | DrawAnnotation
  | ShapeAnnotation
  | ImageAnnotation
  | SignatureAnnotation
  | CheckboxAnnotation;

interface AnnotationBase {
  id: AnnotationId;
}
export interface TextAnnotation extends AnnotationBase {
  kind: "text";
  x: number; y: number; w: number; h: number;
  text: string;
  fontSize: number;
  color: string; // #rrggbb
}
export interface HighlightAnnotation extends AnnotationBase {
  kind: "highlight";
  x: number; y: number; w: number; h: number;
  color: string;
}
export interface DrawAnnotation extends AnnotationBase {
  kind: "draw";
  // Sequence of points in PDF user-space coordinates [x, y]
  points: Array<[number, number]>;
  stroke: string;
  thickness: number;
}
export interface ShapeAnnotation extends AnnotationBase {
  kind: "rect" | "ellipse" | "line";
  x: number; y: number; w: number; h: number;
  stroke: string;
  fill?: string;
  thickness: number;
}
export interface ImageAnnotation extends AnnotationBase {
  kind: "image";
  x: number; y: number; w: number; h: number;
  dataUrl: string;
}
export interface SignatureAnnotation extends AnnotationBase {
  kind: "signature";
  x: number; y: number; w: number; h: number;
  dataUrl: string;
}
export interface CheckboxAnnotation extends AnnotationBase {
  kind: "checkbox";
  x: number; y: number; size: number;
  checked: boolean;
}
