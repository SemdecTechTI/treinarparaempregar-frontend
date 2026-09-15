#FROM ubi9/nodejs-22
FROM registry.salvador.ba.gov.br/library/ubi10.node22:latest
USER 0
ADD . /tmp/src
RUN chown -R 1001:0 /tmp/src
USER 1001

RUN /usr/libexec/s2i/assemble

CMD /usr/libexec/s2i/run