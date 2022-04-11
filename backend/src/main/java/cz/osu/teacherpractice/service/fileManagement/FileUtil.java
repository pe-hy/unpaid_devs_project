package cz.osu.teacherpractice.service.fileManagement;

import java.nio.file.Path;
import java.nio.file.Paths;

public final class FileUtil {

    private FileUtil() {
        // restrict instantiation
    }

    public static final String folderPath =  "incoming-files//";
    public static final Path filePath = Paths.get(folderPath);

}