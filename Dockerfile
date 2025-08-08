FROM python:3.11.13-slim

COPY . /app

# 排除前端node_modules
RUN rm -rf /app/web/node_modules

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 9999

# 复制并设置入口脚本权限
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["python", "run.py"]