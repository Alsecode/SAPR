# САПР - Система автоматизации прочностных расчётов
1. В репозитории имеются отдельные файлы по техническому заданию, примеру работы программы и архив со скриншотами нескольких разных примеров работы программы.
2. Сама программа принимает от пользователя ввод параметров стержня и нагрузки, выводит графики (эпюры) напряжений на стержнях, усилий, а также их перемещений.
3. Предусмотрена возможность посмотреть все эти компоненты в табличнов виде в конкретном сечении какого-либо стержня.
4. Все введенные данные проверяются на корректность.
5. Визуализация конструкции, а также графики реализованы через Canvas.
6. Сохранение и загрузка "файлов" выполнены с использованием LocalStorage: пользователь вводит название "файла", данные разбиваются на несколько массивов с соответстующими названиями. Затем с помощью этого названия можно загрузить все введенные ранее данные.
7. Основные расчёты программы - решение системы линейных алгебраических уравнений.

P.S. Многие переменные в JS-файле названы в соответствии с теоретической частью компьютерной механики

![alt text](Пример работы программы.png.PNG)
