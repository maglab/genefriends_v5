FROM python:2.7
COPY . .
EXPOSE 9000
RUN pip install flask
RUN pip install --user --quiet suds
RUN pip install suds-jurko
CMD python api.py