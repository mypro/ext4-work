package cn.net.dbi.boom.filter;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.*;
import java.util.Map;

public class JsonpCallbackFilter implements Filter {

    private static Log log = LogFactory.getLog(JsonpCallbackFilter.class);

    public void init(FilterConfig fConfig) throws ServletException {
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        @SuppressWarnings("unchecked")
        Map<String, String[]> parms = httpRequest.getParameterMap();
        if (parms.containsKey("callback")) {
            if (log.isDebugEnabled())
                log.debug("Wrapping response with JSONP callback '" + parms.get("callback")[0] + "'");
            OutputStream out = httpResponse.getOutputStream();
            GenericResponseWrapper wrapper = new GenericResponseWrapper(httpResponse);
            chain.doFilter(request, wrapper);
            out.write(new String(parms.get("callback")[0] + "(").getBytes());
            out.write(wrapper.getData());
            out.write(new String(");").getBytes());
            wrapper.setContentType("text/javascript;charset=UTF-8");
            out.close();
        } else {
            chain.doFilter(request, response);
        }
    }


    public void destroy() {
    }

    class GenericResponseWrapper extends HttpServletResponseWrapper {

        private ByteArrayOutputStream output;
        private int contentLength;
        private String contentType;

        public GenericResponseWrapper(HttpServletResponse response) {
            super(response);
            output = new ByteArrayOutputStream();
        }

        public byte[] getData() {
            return output.toByteArray();
        }

        public ServletOutputStream getOutputStream() {
            return new FilterServletOutputStream(output);
        }

        public PrintWriter getWriter() {
            return new PrintWriter(getOutputStream(), true);
        }

        public void setContentLength(int length) {
            this.contentLength = length;
            super.setContentLength(length);
        }

        public int getContentLength() {
            return contentLength;
        }

        public void setContentType(String type) {
            this.contentType = type;
            super.setContentType(type);
        }

        public String getContentType() {
            return contentType;
        }
    }

    class FilterServletOutputStream extends ServletOutputStream {

        private DataOutputStream stream;

        public FilterServletOutputStream(OutputStream output) {
            stream = new DataOutputStream(output);
        }

        public void write(int b) throws IOException {
            stream.write(b);
        }

        public void write(byte[] b) throws IOException {
            stream.write(b);
        }

        public void write(byte[] b, int off, int len) throws IOException {
            stream.write(b, off, len);
        }

    }
}