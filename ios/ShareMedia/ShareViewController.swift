import UIKit
import Social
import MobileCoreServices
import Photos

class ShareViewController: SLComposeServiceViewController {

    let shareProtocol = "Blue10ShareMedia"
    var sharedMedia: [URL] = []

    let imageType = kUTTypeImage as String
    let pdfType = kUTTypePDF as String

    override func isContentValid() -> Bool { true }

    override func viewDidLoad() {
        super.viewDidLoad()
        handleIncoming()
    }

    private func handleIncoming() {
        guard let content = extensionContext?.inputItems.first as? NSExtensionItem,
              let attachments = content.attachments else { return }

        for (index, attachment) in attachments.enumerated() {
            if attachment.hasItemConformingToTypeIdentifier(imageType) ||
               attachment.hasItemConformingToTypeIdentifier(pdfType) {
                handleAttachment(attachment: attachment, index: index, total: attachments.count)
            }
        }
    }

    private func handleAttachment(attachment: NSItemProvider, index: Int, total: Int) {
        let type = attachment.hasItemConformingToTypeIdentifier(imageType) ? imageType : pdfType
        attachment.loadItem(forTypeIdentifier: type, options: nil) { [weak self] data, error in
            guard let self = self, error == nil, let url = data as? URL else {
                self?.dismissWithError()
                return
            }

            // copy to App Group container
            let fileName = UUID().uuidString + "." + url.pathExtension
            guard let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.blue10.app") else {
                self.dismissWithError()
                return
            }
            let dstURL = containerURL.appendingPathComponent(fileName)

            do {
                if FileManager.default.fileExists(atPath: dstURL.path) {
                    try FileManager.default.removeItem(at: dstURL)
                }
                try FileManager.default.copyItem(at: url, to: dstURL)
                self.sharedMedia.append(dstURL)
            } catch {
                print("Cannot copy file: \(error)")
            }

            if index == total - 1 {
                DispatchQueue.main.async {
                    self.sendToHostApp()
                }
            }
        }
    }

    private func sendToHostApp() {
        let urls = self.sharedMedia.map { $0.lastPathComponent }

        guard let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.blue10.app") else {
            dismissWithError()
            return
        }

        let jsonURL = containerURL.appendingPathComponent("shared.json")

        do {
            let data = try JSONEncoder().encode(urls)
            try data.write(to: jsonURL)
        } catch {
            print("Cannot write shared.json: \(error)")
        }

        if let encodedPath = jsonURL.path.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let url = URL(string: "\(shareProtocol)://filePath=\(encodedPath)") {
            redirectToHostApp(with: url)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }

    private func redirectToHostApp(with url: URL) {
        var responder: UIResponder? = self
        while let r = responder {
            if let app = r as? UIApplication {
                if #available(iOS 18.0, *) {
                    app.open(url, options: [:], completionHandler: nil)
                } else {
                    _ = app.perform(NSSelectorFromString("openURL:"), with: url)
                }
                break
            }
            responder = r.next
        }
    }

    private func dismissWithError() {
        let alert = UIAlertController(title: "Error", message: "Error loading data", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .cancel))
        self.present(alert, animated: true, completion: nil)

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }

    override func didSelectPost() {}
    override func configurationItems() -> [Any]! { [] }

}

