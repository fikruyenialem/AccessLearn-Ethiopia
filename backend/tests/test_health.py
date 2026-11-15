def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "AccessLearn Ethiopia" in data["message"]
    assert "health" in data
    assert "docs" in data


def test_health_check_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["healthy"] is True
    assert data["database"] == "connected"
    assert "version" in data


def test_openapi_spec_available(client):
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    spec = response.json()
    assert spec["info"]["title"] == "AccessLearn Ethiopia API"
    assert "/api/v1/health" in spec["paths"]
