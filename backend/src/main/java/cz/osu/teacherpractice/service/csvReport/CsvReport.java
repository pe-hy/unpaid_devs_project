package cz.osu.teacherpractice.service.csvReport;

import com.opencsv.CSVWriter;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.jni.Local;
import org.springframework.stereotype.Service;

import java.io.*;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvReport {

    private final PracticeRepository practiceRepository;

    public String createReport(String filePath, LocalDate start, LocalDate end)
    {

        List<Practice> practices = practiceRepository.findByDateBetweenAndDateBefore(start, end, LocalDate.now());

        File file = new File(filePath);
        try {
            // create FileWriter object with file as parameter
//            FileWriter outputfile = new FileWriter(file);

            // create CSVWriter object filewriter object as parameter
            FileOutputStream os = new FileOutputStream(file);
            os.write(0xef);
            os.write(0xbb);
            os.write(0xbf);
            CSVWriter writer = new CSVWriter(new OutputStreamWriter(os));

            // adding header to csv
            String[] header = { "Datum", "Čas", "Škola", "Učitel", "Student" };
            writer.writeNext(header);

            for (Practice p :
                    practices) {
                String[] data = { p.getDate().toString(), p.getEnd().toString(), p.getTeacher().getSchool().getName(), p.getTeacher().getFirstName() + " " + p.getTeacher().getSecondName() + " (" + p.getTeacher().getUsername() + ")" };
                writer.writeNext(data);
                List<User> students = p.getStudents();
                System.out.println(students.size());
            }

            // closing writer connection
            writer.close();
        }
        catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return "export fail";
        }
        return "export success";
    }
}
