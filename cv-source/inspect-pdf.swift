import AppKit
import Foundation
import PDFKit

guard CommandLine.arguments.count == 3,
      let pdf = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1])) else {
    fatalError("Usage: swift inspect-pdf.swift PDF OUTPUT-DIRECTORY")
}
let output = URL(fileURLWithPath: CommandLine.arguments[2])
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
guard pdf.pageCount == 2 else { fatalError("Expected two pages") }
var text = ""
for index in 0..<pdf.pageCount {
    guard let page = pdf.page(at: index) else { fatalError("Missing page") }
    let bounds = page.bounds(for: .mediaBox)
    print("PAGE \(index + 1): \(bounds)")
    text += "\nPAGE \(index + 1)\n" + (page.string ?? "")
    for annotation in page.annotations {
        guard let url = annotation.url else { continue }
        let label = page.selection(for: annotation.bounds)?.string ?? ""
        guard bounds.contains(annotation.bounds) else { fatalError("Link outside page") }
        print("LINK \(index + 1) | \(label.replacingOccurrences(of: "\n", with: " ")) | \(url.absoluteString)")
    }
    let image = page.thumbnail(of: NSSize(width: 1530, height: 1980), for: .mediaBox)
    guard let tiff = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let png = bitmap.representation(using: .png, properties: [:]) else {
        fatalError("Cannot render PDF")
    }
    try png.write(to: output.appendingPathComponent("page-\(index + 1).png"))
}
try text.write(to: output.appendingPathComponent("text.txt"), atomically: true, encoding: .utf8)
