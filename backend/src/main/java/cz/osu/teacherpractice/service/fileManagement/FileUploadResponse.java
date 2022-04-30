package cz.osu.teacherpractice.service.fileManagement;

public class FileUploadResponse {

    private String message;

    public FileUploadResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
